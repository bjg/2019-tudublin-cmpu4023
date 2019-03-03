    exports.getHMAC = (req) => {
      var token = req.headers.authorization.split(' ');
      var key = token[1].split('=');
      var cSignature = token[2].split('=');

      return {"Key": key[1], "Signature": cSignature[1]};
    }