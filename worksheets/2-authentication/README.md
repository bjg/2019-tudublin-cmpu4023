# Lab Week 2
# Endpoints and testing

## POST /login

Accepts a user name and password and returns a jsonwebtoken as a cookie
if the details are correct.

### Success

```bash
	curl -i --data "username=me&password=mypass" http://localhost:3000/login
```

	HTTP/1.1 200 OK
	X-Powered-By: Express
	Access-Control-Allow-Origin: localhost:3000
	Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept
	Set-Cookie: token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NTE2MTU4NDYsImV4cCI6MTU1MTYxOTQ0NiwiYXVkIjoibG9jYWxob3N0IiwiaXNzIjoibG9jYWxob3N0Iiwic3ViIjoibWUifQ.HRnUItGYHZqyrAp_tqjiDAgpgo8UkyG5B_DWrIkJLqhhxdZn06dPTga2aBynJu_U3VMEDMdHJPpfa-nuQ95SUCbYkdxicA5bxtRVoTZbyzycuMNz-xeQNxMN0oyeAWykc2bqIC2FTHtNHNVR1SbMNiIVOOFjVdh7qqZ12pBrz_L-aRvTjq04tB-ixMhQoPY8JK0yX1fqIzloH5-RjDqrqM0NNcFfjsU48I0sw3dBLyxaVzY0ChFzwao6GBgLXnFDaOzhOKEUnM9fRz6pD2OAXYgaq5x08-25J5vDRGmFZnIl6sWHAaWJ5jJ_6vydYj96-TiDFN3ASjGUKdyOPuagFA; Path=/
	Content-Type: text/html; charset=utf-8
	Content-Length: 17
	ETag: W/"11-Hz/9uJjVWCC5yHgZx4c3zqo3Cqk"
	Date: Sun, 03 Mar 2019 12:24:06 GMT
	Connection: keep-alive

	"res":"Logged in"
	
### Failure
	
```bash
	curl -i --data "username=me&password=mypa2" http://localhost:3000/login
```	
	
	HTTP/1.1 401 Unauthorized
	X-Powered-By: Express
	Content-Type: text/html; charset=utf-8
	Content-Length: 41
	ETag: W/"29-wqhACiTKK/bBjdxr0pOKgkwn5jQ"
	Date: Sun, 03 Mar 2019 12:26:16 GMT
	Connection: keep-alive

	"error":"Incorrect user name or password"

## GET /video-games

Returns a list of video-games if the client has a valid jwt.

### Success

```bash
	curl -i -H "Accept: application/json" -H "Cookie: token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NTE2MTU4NDYsImV4cCI6MTU1MTYxOTQ0NiwiYXVkIjoibG9jYWxob3N0IiwiaXNzIjoibG9jYWxob3N0Iiwic3ViIjoibWUifQ.HRnUItGYHZqyrAp_tqjiDAgpgo8UkyG5B_DWrIkJLqhhxdZn06dPTga2aBynJu_U3VMEDMdHJPpfa-nuQ95SUCbYkdxicA5bxtRVoTZbyzycuMNz-xeQNxMN0oyeAWykc2bqIC2FTHtNHNVR1SbMNiIVOOFjVdh7qqZ12pBrz_L-aRvTjq04tB-ixMhQoPY8JK0yX1fqIzloH5-RjDqrqM0NNcFfjsU48I0sw3dBLyxaVzY0ChFzwao6GBgLXnFDaOzhOKEUnM9fRz6pD2OAXYgaq5x08-25J5vDRGmFZnIl6sWHAaWJ5jJ_6vydYj96-TiDFN3ASjGUKdyOPuagFA" -X GET http://localhost:3000/video-games
```	
	
	HTTP/1.1 200 OK
	X-Powered-By: Express
	Content-Type: application/json; charset=utf-8
	Content-Length: 728
	ETag: W/"2d8-wrI2DSvqjAUvRvnFbQV7y76S6yM"
	Date: Sun, 03 Mar 2019 12:28:03 GMT
	Connection: keep-alive

	[{"id":1,"title":"New Game","rating":"5.5","price":"55"},{"id":2,"title":"New Game","rating":"5.5","price":"55"},{"id":3,"title":"game","rating":"5.5","price":"50"},{"id":4,"title":"best game","rating":"9","price":"20"},{"id":5,"title":"New Game","rating":"5.5","price":"55"},{"id":6,"title":"New Game","rating":"5.5","price":"55"},{"id":7,"title":"New Game","rating":"5.5","price":"55"},{"id":8,"title":"New Game","rating":"5.5","price":"55"},{"id":9,"title":"New Game","rating":"5.5","price":"55"},{"id":10,"title":"New Game","rating":"5.5","price":"55"},{"id":11,"title":"New Game","rating":"5.5","price":"55"},{"id":12,"title":"New Game","rating":"5.5","price":"55"},{"id":13,"title":"New Game","rating":"5.5","price":"55"}]
	
	
### Failure

```bash
	curl -i -H "Accept: application/json" -H "Cookie: token=notreallyajwt" -X GET http://localhost:3000/video-games
```	
	
	HTTP/1.1 401 Unauthorized
	X-Powered-By: Express
	Content-Type: text/html; charset=utf-8
	Content-Length: 26
	ETag: W/"1a-AoNx2ejDaOfzYQ+JvgEWdp2fOM0"
	Date: Sun, 03 Mar 2019 12:29:44 GMT
	Connection: keep-alive

	"error":"Not Autheticated"

## POST /video-games

Returns a list of video-games if the client has a valid jwt AND the subject of the jwt is a valid user

### Success

```bash
	curl -i -H "Accept: application/json" -H "Cookie: token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NTE2MTU4NDYsImV4cCI6MTU1MTYxOTQ0NiwiYXVkIjoibG9jYWxob3N0IiwiaXNzIjoibG9jYWxob3N0Iiwic3ViIjoibWUifQ.HRnUItGYHZqyrAp_tqjiDAgpgo8UkyG5B_DWrIkJLqhhxdZn06dPTga2aBynJu_U3VMEDMdHJPpfa-nuQ95SUCbYkdxicA5bxtRVoTZbyzycuMNz-xeQNxMN0oyeAWykc2bqIC2FTHtNHNVR1SbMNiIVOOFjVdh7qqZ12pBrz_L-aRvTjq04tB-ixMhQoPY8JK0yX1fqIzloH5-RjDqrqM0NNcFfjsU48I0sw3dBLyxaVzY0ChFzwao6GBgLXnFDaOzhOKEUnM9fRz6pD2OAXYgaq5x08-25J5vDRGmFZnIl6sWHAaWJ5jJ_6vydYj96-TiDFN3ASjGUKdyOPuagFA" --data "title=test%20game&rating=5.5&price=25" http://localhost:3000/video-games
```	
	
	HTTP/1.1 201 Created
	X-Powered-By: Express
	Content-Type: text/html; charset=utf-8
	Content-Length: 19
	ETag: W/"13-dEpsA2HjHsa1nH7smh+GxN/p2E0"
	Date: Sun, 03 Mar 2019 12:31:59 GMT
	Connection: keep-alive

	"Success":"Created"

### Failure

In this example the signature is invalidated by deleting a few base64 characters

```bash
	curl -i -H "Accept: application/json" -H "Cookie: token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NTE2MTU4NDYsImV4cCI6MTU1MTYxOTQ0NiwiYXVkIjoibG9jYWxob3N0IiwiaXNzIjoibG9jYWxob3N0Iiwic3ViIjoibWUifQ.HRnUItGYHZqyrAp_tqjiDAgpgo8UkyG5B_DWrIkJLqhhxdZn06dPTga2aBynJu_U3VMEDMdHJPpfa-nuQ95SUCbYkdxicA5bxtRVoTZbyzycuMNz-xeQNxMN0oyeAWykc2bqIC2FTHtNHNVR1SbMNiIVOOFjVdh7qqZ12pBrz_L-aRvTjq04tB-ixMhQoPY8JK0yX1fqIzloH5-RjDqrqM0NNcFfjsU48I0sw3dBLyxaVzY0ChFzwao6GBgLXnFDaOzhOKEUnM9fRz6pD2OAXYgaq5x08-25J5vDRGmFZnIl6sWHAaWJ5jJ_6vydYj96-TiDFN3ASjGUK" --data "title=test%20game&rating=5.5&price=25" http://localhost:3000/video-games
```	
	
	HTTP/1.1 401 Unauthorized
	X-Powered-By: Express
	Content-Type: text/html; charset=utf-8
	Content-Length: 26
	ETag: W/"1a-AoNx2ejDaOfzYQ+JvgEWdp2fOM0"
	Date: Sun, 03 Mar 2019 12:33:34 GMT
	Connection: keep-alive

	"error":"Not Autheticated"
	
	
## POST /hmac-video-games

Test Client about for tests

	secret: YhIkWESsY+TFiqguUQx6rW8TqgMkzE2VMl78l3Lv8ESSwL5sgiuZeA==
	access key: CTgvRZjOudWAUbeTKu3N3fmkzVKC
	
	--Successful--
	access key: CTgvRZjOudWAUbeTKu3N3fmkzVKC
	title: New Game
	price: 55
	rating: 5.5
	Signature: ndilCBBLbSGNdzGmjR2/oKuyL4w=

	StatusCode: 201
	ResponseBody :"Success":"Created"


	--Modifying values after sign gen--
	access key: CTgvRZjOudWAUbeTKu3N3fmkzVKC
	title: New Game
	price: 54
	rating: 5.5
	Signature: ndilCBBLbSGNdzGmjR2/oKuyL4w=

	StatusCode: 401
	ResponseBody :"error":"Invalid Signature"


	--Incorrect Signature--
	access key: CTgvRZjOudWAUbeTKu3N3fmkzVKC
	title: New Game
	price: 54
	rating: 5.5
	Signature: vasjfbjabfadj

	StatusCode: 401
	ResponseBody :"error":"Invalid Signature"


	--Incorrect Access key--
	access key: hguhssqfew
	title: New Game
	price: 54
	rating: 5.5
	Signature: ndilCBBLbSGNdzGmjR2/oKuyL4w=

	StatusCode: 401
	ResponseBody :"error":"Error, Access Key Invalid"
	
## POST /hmac-key (not part of assignment)

Uses diffie-helmann to generate a shared secret in both client and server in order to make HMACs for testing