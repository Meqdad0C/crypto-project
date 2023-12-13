import { Button } from '@/components/ui/button';
import AES from 'crypto-js/aes';
import CryptoJS from 'crypto-js';
import forge from 'node-forge';

const ButtonWrapper = ({ children }: { children: React.ReactNode; }) => (
  <div className="flex items-center space-x-2">
    {children}

    <Button
      onClick={() => {
        const encrypted = AES.encrypt(
          'ana ba7abk ya bedonzy, yours Hala',
          CryptoJS.enc.Hex.parse('000102030405060708090a0b0c0d0e0f'),
          {
            iv: CryptoJS.enc.Hex.parse('101112131415161718191a1b1c1d1e1f'),
            mode: CryptoJS.mode.CFB,
          }
        );
        console.log('[encrypted]', encrypted.toString());
        // console.log('[salt]', encrypted.salt.toString())
        console.log('[iv]', encrypted.iv.toString());
        console.log('[key]', encrypted.key.toString());
        const decrypted = AES.decrypt(
          encrypted.toString(),
          CryptoJS.enc.Hex.parse('000102030405060708090a0b0c0d0e0f'),
          {
            iv: CryptoJS.enc.Hex.parse('101112131415161718191a1b1c1d1e1f'),
            mode: CryptoJS.mode.CFB,
          }
        );
        console.log('[decrypted]', decrypted.toString(CryptoJS.enc.Utf8));
      }}
    >
      encrypt
    </Button>
    <Button
      onClick={() => {
        const encrypt = CryptoJS.SHA512('HALAHALA');
        console.log(encrypt.toString(CryptoJS.enc.Hex));
        console.log(encrypt.toString(CryptoJS.enc.Base64));
      }}
    >
      sha
    </Button>
    <Button
      onClick={() => {
        const rsa = forge.pki.rsa;
        const keypair = rsa.generateKeyPair({ bits: 2048, workers: 2 });
        const privateKey = keypair.privateKey;
        const publicKey = keypair.publicKey;
        const my_pub_key = forge.pki.publicKeyFromPem(
          `
-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEAmPfybe/wzsgKMRrD5/1EpdoHc+GjwcMfBjBOFAnr83K9vgpdXqAy
85gVTI4r5VgSWrOU54LCE4gFb/3ufpRTHfKV29xPbYj889QYwR3OE1G+YXh52IKH
h4Hwa8s0SBINp1rCTTf+vh0CFPdNmLSnPmVGkJAhOG4w0gTta+5YpVYJnXoB9N3I
dMtFIu1miHwQqw1k5gqEsO3FTfWfU7MWxZ1gpN8v2L65Qc2vUlSoXC7hIXps7A8T
v4q09wTzz4B4wST6QDPGMJ0ndDjIsyvNVzTlXDHyLZeUzW8BP8RdoBfajuAYIym6
QkZwYG5l/aKC2vil+Un5Fgydd48cGcOPpQIDAQAB
-----END RSA PUBLIC KEY-----
`
        );
        const my_private_key = forge.pki.privateKeyFromPem(
          `-----BEGIN RSA PRIVATE KEY-----
          MIIEowIBAAKCAQEAmPfybe/wzsgKMRrD5/1EpdoHc+GjwcMfBjBOFAnr83K9vgpd
          XqAy85gVTI4r5VgSWrOU54LCE4gFb/3ufpRTHfKV29xPbYj889QYwR3OE1G+YXh5
          2IKHh4Hwa8s0SBINp1rCTTf+vh0CFPdNmLSnPmVGkJAhOG4w0gTta+5YpVYJnXoB
          9N3IdMtFIu1miHwQqw1k5gqEsO3FTfWfU7MWxZ1gpN8v2L65Qc2vUlSoXC7hIXps
          7A8Tv4q09wTzz4B4wST6QDPGMJ0ndDjIsyvNVzTlXDHyLZeUzW8BP8RdoBfajuAY
          Iym6QkZwYG5l/aKC2vil+Un5Fgydd48cGcOPpQIDAQABAoIBAAJ7KxR7atV/yyKG
          w5y0r/NcuPg5NbXD23H3QJz0mD4no0o80szhHlJzKg1G1RFwP0P3W7fxmAJHF4d8
          f+zPrRV0RNf/F864BRpTW19ug1Qu5D6ifJ91ZotdITAuaJeuq0gGodYszVX6FHmQ
          lVKfw4Kwk9dubwuCRgpyCAPTJt7vos2XK6qTLkI3IjZf711DaVXADYioOAX4fFif
          esfDzkyVrCS8+FdIQge56LHqX9GGDhU9hiSMMK/XqvKyXWpdkdrLsy9ojsitd5FM
          XMXr6b+WjTikd6wBVZeiyBo8hgWak+rGbMB02Sxb1cnS6b9z6KouEyigmsGpWZyQ
          OhP9OVUCgYEA68m5Xyogqm+ZhGk9k5YMD6bES81CM1CW2upa9qjaIFSS8F5ZW7FW
          Pd/sr65OG9goZZbYJVRiVlxlY6HEtjC1LRpT76Kso2rptsGBgKzqJPW/2OnRCC07
          rVy4HnPlBN2gAhofonZ5/nttWgXl5CW9dtSK1GKVNDUW0Uhb4XUBE4sCgYEAphTI
          R9IAG4RByQgpQ5tP1Gy2H+jq1U3p/C8lR1BlWZGPMz9FRI9NMXO2/jzvQK31uCi2
          LRWMK+teccHJ95q0H337rC9KZqEI4ARfmlG2Dpyg7NoCbxC72bhkGqoBe2h+tD80
          pxKnJyLXm19r86qzpiIv2CmrCyLr255Cunidj48CgYEAiWVR9KdKw6YmUec1b4PW
          4WPvLLCd6+MBFO3NNcBs4rwFp7WC4pByzblnZXPvpgAOgiwlJZOHfgV3O1hvlS7K
          1E5sLM6hRNSu/cTCnuWjxwfA1Dhjix04kiveSjiEcpJmg/MPDg91xRnNPdEEBi8L
          uWveviX4BaUN98PvbnBMwUMCgYBk3VZNmBKMo6Q4bYZyEs9G2cc6VgDZDvq+N/vR
          9de3sBliLFjrLITbNcW7XlKH257R+5e4hc+dlNLFD8aTZBdk0OSaTBZJgh+bvcw6
          Msn40dNCRZ0YyvbrYXsaXomL44if+4sEtOVjdVuwdyFe2RtGGJkqFRRWLR1FQjaQ
          fVRjrQKBgC8kTrr5r+iUXh6PZ65FFyylQrPBGy9lhBXXCNpLJ2YCStWfoV+lriSw
          3zRYRhgsUUAU5Hccvn/Q63+dcM5pWSEW2LK2t5hs3A0+9FzY3DwAPVwdaYdHNiJx
          tR7ml8FmVQmN82y0jRJFPanjNsRG/+PzCM+iUthz0FbnJekGu8CH
          -----END RSA PRIVATE KEY-----`
        );

        // const privateKey = forge.pki.privateKeyFromPem(private_rsa)
        // const publicKey = forge.pki.publicKeyFromPem(public_rsa)
        console.log(forge.pki.publicKeyToRSAPublicKeyPem(publicKey));
        console.log(forge.pki.privateKeyToPem(privateKey));

        const encrypted = publicKey.encrypt('meqdad');
        console.log('enc', forge.util.encode64(encrypted));
        const altered_encrypted = forge.util.decode64(
          'N3KpNjNKUI1pRWKg9Z1Ntw9sepKJcacxnrUzzeVoeQ9LOzlE/kL1gOjz+UC+HCpiyxvmFbQMGlXzUIzzfFFZTBVmMasLR2aU1cXCQFPOtUqpF88/9VmB/w0xIa4IJTbiSGDqWV5Lgkjy3TqvwtE2qWclDaKzapX8yL9efl4F9DEOWm9Hjt4BRHaKcAwKRtq24uPK0BDKAlZC/lVB19o+qwf8jff9oPipQ2iYiTCckb7zEBVzVyUAkFQNs6n79rine56HDMiVIUKz+TqP1v6bWSJB9cenLmj5ECjnHyPze7wKdX8hmAErOGDVYAfHwUrMD6uPf1qfu7K0ZMVXm/bZcQ=='
        );
        const altered_decrypted = privateKey.decrypt(altered_encrypted);
        const decrypted = privateKey.decrypt(encrypted);
        console.log('dec', decrypted);
        console.log('alt dec', altered_decrypted);

        const md = forge.md.sha512.create();
        md.update('HALAHALA', 'utf8');
        const hash = md.digest();
        console.log('hash ', hash.toHex());

        const signature = privateKey.sign(md);

        console.log(forge.util.encode64(signature));
        const my_signature = forge.util.decode64(
          'UhzkVY0Bsn1ZhDq8i/KWhxYNKIoEDbJBgU9/bUmESrLCjaD5FPPQP/3v/yFaZIzKF9s6mpPH6Qe/dh3d8qe5+mWN308cXk7WGxE/N39zeK8mPhWe/DO+tZ0OxUZvV8v1pzHNx5Ya2ikwvwJ9fb73cDSjW49CyKUORQV6gPfqb9ZUdsitG9jxrCI8PU1e66yZjnXpgjIiCdUiJXlI1GWBQ240ElG/+Q47T4UyejhXa7KdXID4+LqcdbGAh03MHwT0sb7PEBStrSCgB7pmNJbW/hZxI/UR0K63aHXKdOrMSKEXJK2Tnkr84RMPfTBy1bLnXp2h3dI7M89R1QYvLBQJKA=='
        );
        const verified = my_pub_key.verify(md.digest().bytes(), my_signature);
        console.log(verified);
      }}
    >
      RS512
    </Button>

    <Button
      onClick={() => {
        const rsa = forge.pki.rsa;
        const keypair_1 = rsa.generateKeyPair({ bits: 2048, workers: 2 });
        const keypair_2 = rsa.generateKeyPair({ bits: 2048, workers: 2 });
        const message = 'Meqdad loves to love';
        const encrypted = keypair_2.publicKey.encrypt(message);
        const md = forge.md.sha512.create();
        md.update(encrypted, 'utf8');
        const hash = md.digest();
        console.log('hash ', hash.toHex());
        const signature = keypair_1.privateKey.sign(md);
        console.log('signature ', forge.util.encode64(signature));

        console.log(
          'is verified',
          keypair_1.publicKey.verify(md.digest().bytes(), signature)
        );
        console.log('decrypted', keypair_2.privateKey.decrypt(encrypted));
      }}
    >
      Sign and Encrypt
    </Button>
  </div>
);
