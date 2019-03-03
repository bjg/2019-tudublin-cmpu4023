package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"
)

type product struct {
	Name  string  `json:"name"`
	Price float64 `json:"price"`
}

var accessKey = []byte("HB^YErkC}1I@x$nPWoj1")
var secretKey = []byte("yo?rW#_$l[v_ZEa],.!UEvqY)0YJr_`)RpXJ%=&6")

func main() {
	// Parse product details from arguments.
	args := os.Args[1:]
	if len(args) != 2 {
		fmt.Println("Usage: ./client <name> <price>")
		return
	}
	price, err := strconv.ParseFloat(args[1], 64)
	if err != nil {
		log.Fatal("Second argument must be a float")
	}

	// Convert new product to json.
	prod := &product{
		Name:  args[0],
		Price: price,
	}
	prodJson, err := json.Marshal(prod)
	if err != nil {
		log.Fatalf("Failed to marshal product: %s", err)
	}
	message := string(prodJson)

	// Generate timestamp.
	t := time.Now().UTC().Unix()
	timestamp := strconv.FormatInt(t, 10)

	// Hash the combined access key, message body and timestamp.
	var combined []byte
	combined = append(combined, accessKey...)
	combined = append(combined, []byte(message)...)
	combined = append(combined, []byte(timestamp)...)

	mac := hmac.New(sha256.New, secretKey)
	mac.Write(combined)
	hash := hex.EncodeToString(mac.Sum(nil))

	makeRequest(message, timestamp, accessKey, hash)
}

func makeRequest(message string, timestamp string, accessKey []byte, hmacHash string) {
	client := &http.Client{}
	form := url.Values{}
	form.Add("message", message)

	// Create request with message body.
	req, err := http.NewRequest("POST", "http://127.0.0.1:3000/products-hmac", strings.NewReader(form.Encode()))
	if err != nil {
		log.Fatalf("Failed to create request: %s", err)
	}

	// Set headers.
	req.Header.Set("authorization", string(accessKey))
	req.Header.Add("hmac", hmacHash)
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Add("timestamp", timestamp)

	// Send request.
	resp, err := client.Do(req)
	if err != nil {
		log.Fatalf("Request failed: %s", err)
	}

	fmt.Println(resp)
}
