import { Button } from '@/components/ui/button'
import { Textarea } from './components/ui/textarea'
import { Label } from './components/ui/label'
import { ModeToggle } from './components/mode-toggle'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AES from 'crypto-js/aes'
import CryptoJS from 'crypto-js'
import forge from 'node-forge'

const ButtonWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center space-x-2">
    {children}

    <Button
      onClick={() => {
        const encrypted = AES.encrypt(
          'ana ba7abk ya bedonzy, yours Hala',
          CryptoJS.enc.Hex.parse(
            '0003333333333333333333333333333333333333333333333333333330',
          ),
          {
            iv: CryptoJS.enc.Hex.parse(
              '101112131415161718191a1b1c1d1e1f101112131415161718191a1b1c1d1e1f101112131415161718191a1b1c1d1e1f101112131415161718191a1b1c1d1e1f',
            ),
            mode: CryptoJS.mode.CFB,
          },
        )
        console.log('[encrypted]', encrypted.toString())
        console.log('[ciphertext]', encrypted.ciphertext.toString())
        // console.log('[salt]', encrypted.salt.toString())
        console.log('[iv]', encrypted.iv.toString())
        console.log('[key]', encrypted.key.toString())
        const decrypted = AES.decrypt(
          encrypted.toString(),
          CryptoJS.enc.Hex.parse(
            '0003333333333333333333333333333333333333333333333333333330',
          ),
          {
            iv: CryptoJS.enc.Hex.parse(
              '101112131415161718191a1b1c1d1e1f101112131415161718191a1b1c1d1e1f101112131415161718191a1b1c1d1e1f101112131415161718191a1b1c1d1e1f',
            ),
            mode: CryptoJS.mode.CFB,
          },
        )
        console.log('[decrypted]', decrypted.toString(CryptoJS.enc.Utf8))
      }}
    >
      encrypt
    </Button>
    <Button
      onClick={() => {
        const encrypt = CryptoJS.SHA512('HALAHALA')
        console.log(encrypt.toString(CryptoJS.enc.Hex))
        console.log(encrypt.toString(CryptoJS.enc.Base64))
      }}
    >
      sha
    </Button>
    <Button
      onClick={() => {
        const rsa = forge.pki.rsa
        const keypair = rsa.generateKeyPair({ bits: 2048, workers: 2 })
        const privateKey = keypair.privateKey
        const publicKey = keypair.publicKey
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
`,
        )
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
          -----END RSA PRIVATE KEY-----`,
        )

        // const privateKey = forge.pki.privateKeyFromPem(private_rsa)
        // const publicKey = forge.pki.publicKeyFromPem(public_rsa)
        console.log(forge.pki.publicKeyToRSAPublicKeyPem(publicKey))
        console.log(forge.pki.privateKeyToPem(privateKey))

        const encrypted = publicKey.encrypt('meqdad')
        console.log('enc', forge.util.encode64(encrypted))
        const altered_encrypted = forge.util.decode64(
          'N3KpNjNKUI1pRWKg9Z1Ntw9sepKJcacxnrUzzeVoeQ9LOzlE/kL1gOjz+UC+HCpiyxvmFbQMGlXzUIzzfFFZTBVmMasLR2aU1cXCQFPOtUqpF88/9VmB/w0xIa4IJTbiSGDqWV5Lgkjy3TqvwtE2qWclDaKzapX8yL9efl4F9DEOWm9Hjt4BRHaKcAwKRtq24uPK0BDKAlZC/lVB19o+qwf8jff9oPipQ2iYiTCckb7zEBVzVyUAkFQNs6n79rine56HDMiVIUKz+TqP1v6bWSJB9cenLmj5ECjnHyPze7wKdX8hmAErOGDVYAfHwUrMD6uPf1qfu7K0ZMVXm/bZcQ==',
        )
        const altered_decrypted = privateKey.decrypt(altered_encrypted)
        const decrypted = privateKey.decrypt(encrypted)
        console.log('dec', decrypted)
        console.log('alt dec', altered_decrypted)

        const md = forge.md.sha512.create()
        md.update('HALAHALA', 'utf8')
        const hash = md.digest()
        console.log('hash ', hash.toHex())

        const signature = privateKey.sign(md)

        console.log(forge.util.encode64(signature))
        const my_signature = forge.util.decode64(
          'UhzkVY0Bsn1ZhDq8i/KWhxYNKIoEDbJBgU9/bUmESrLCjaD5FPPQP/3v/yFaZIzKF9s6mpPH6Qe/dh3d8qe5+mWN308cXk7WGxE/N39zeK8mPhWe/DO+tZ0OxUZvV8v1pzHNx5Ya2ikwvwJ9fb73cDSjW49CyKUORQV6gPfqb9ZUdsitG9jxrCI8PU1e66yZjnXpgjIiCdUiJXlI1GWBQ240ElG/+Q47T4UyejhXa7KdXID4+LqcdbGAh03MHwT0sb7PEBStrSCgB7pmNJbW/hZxI/UR0K63aHXKdOrMSKEXJK2Tnkr84RMPfTBy1bLnXp2h3dI7M89R1QYvLBQJKA==',
        )
        const verified = my_pub_key.verify(md.digest().bytes(), my_signature)
        console.log(verified)
      }}
    >
      RS512
    </Button>

    <Button
      onClick={() => {
        const rsa = forge.pki.rsa
        const keypair_1 = rsa.generateKeyPair({ bits: 2048, workers: 2 })
        const keypair_2 = rsa.generateKeyPair({ bits: 2048, workers: 2 })
        const message = 'Meqdad loves to love'
        const encrypted = keypair_2.publicKey.encrypt(message)
        const md = forge.md.sha512.create()
        md.update(encrypted, 'utf8')
        const hash = md.digest()
        console.log('hash ', hash.toHex())
        const signature = keypair_1.privateKey.sign(md)
        console.log('signature ', forge.util.encode64(signature))

        console.log(
          'is verified',
          keypair_1.publicKey.verify(md.digest().bytes(), signature),
        )
        console.log('decrypted', keypair_2.privateKey.decrypt(encrypted))
      }}
    >
      Sign and Encrypt
    </Button>
  </div>
)

function App() {
  const private_rsa = `-----BEGIN RSA PRIVATE KEY-----
  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
  -----END RSA PRIVATE KEY-----`

  const public_rsa = `-----BEGIN PUBLIC KEY-----
  MIICITANBgkqhkiG9w0BAQEFAAOCAg4AMIICCQKCAgBpr7playzJGogXXZFWvcwv
  pMQWOcv2klGiJkLjE800yRJPDlqSXSQxrxbj64PpOpgkcwhiNdu03k7eg/Yvr1VU
  oQCvfW0CQ362SelfTcJiwqD63j/9NQswLwkbpqhAiH3mY1NqE8C/wc03zX/XV7Z+
  IVKiF36gGfdiCIfQTLC1u+g+NRhWP7+HlExLTLuy69r9EvVEdL4pLgZVy+NSwgoH
  RBVV2R96LkLnJQV4i2MnM+Jx+uUmr5sqZf7j2z6FZOorAETXVj9S5ob9TWxRNv+v
  G1QbPvMqJP7TMqMx40LcKefEKJhDiqUtgcxUq+eiBngJOWaEPLXtn0I2EjYTetBe
  QEoBQ3DnPQN4/pjJx/cjxPx+R5sscemMME59C2Cwp8Or74Asty1a5UUUS36l+BB+
  jHYqRMZjIf5B228Lo/Q8umnnVcW0Rr+nSZc1UMwhNNs5l0x412tQOgUK09Imurnh
  PPNvw15h88HbvLnH50EULhbzftspAzo/5KDasspNrE62KfO9FfpanGSYps+dM333
  YefiFuXuatvw373F/OeVeIDbMRuifCiMTjMGUTSifLS6eIIL1sq+sCiEVFmZjPb3
  LIQlLUuT0QfUSnmAVd8X45EHGBW11fJT80A8QXOcuI+K/zUndCBh9SjAQtet4Fhn
  G67Iwg0Kxf6jEA7+8/XgFQIDAQAB
  -----END PUBLIC KEY-----`

  return (
    <>
      <ButtonWrapper children={undefined} />
      <div className="absolute right-5 top-5">
        <ModeToggle />
      </div>
      <h1 className="pt-10 text-center text-4xl font-bold text-gray-900 dark:text-gray-100">
        CSE451 - Project
      </h1>
      <div className="container h-full py-6">
        <Tabs defaultValue="ed">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ed">Encrypt & Decrypt</TabsTrigger>
            <TabsTrigger value="gen">
              Generate Public/Private Key Pair
            </TabsTrigger>
            <TabsTrigger value="sv">Sign & Verify</TabsTrigger>
          </TabsList>
          <TabsContent value="ed">
            <main className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
              <Card>
                <CardHeader>
                  <CardTitle>Encrypt & Decrypt</CardTitle>
                  <CardDescription>
                    Select the algorithm and enter the text to encrypt or
                    decrypt.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <article className="flex flex-col space-y-4">
                    <div className="grid h-full gap-6 lg:grid-cols-2">
                      <div className="flex flex-col space-y-4">
                        <div className="flex flex-1 flex-col space-y-2">
                          <Label htmlFor="input" className="text-lg">
                            Input
                          </Label>
                          <Textarea
                            id="input"
                            placeholder="We is going to the market."
                            className="flex-1 lg:min-h-[200px]"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="key">Key</Label>
                          <Textarea
                            id="key"
                            placeholder="Enter your key here. Or leave it empty to generate a random key."
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="iv">IV</Label>
                          <Textarea
                            id="iv"
                            placeholder="Enter your IV here. Or leave it empty to generate a random IV. If needed."
                          />
                        </div>
                      </div>
                      <div className="flex flex-col space-y-4">
                        <div className="flex flex-1 flex-col space-y-2">
                          <Label htmlFor="output" className="text-lg">
                            Output
                          </Label>
                          <Textarea
                            id="output"
                            placeholder="We is going to the market."
                            className="flex-1 lg:min-h-[200px]"
                          />
                        </div>
                      </div>
                    </div>
                  </article>
                </CardContent>
                <CardFooter>
                  <Button>Save changes</Button>
                </CardFooter>
              </Card>
              <aside className=" w-[350px] flex-col sm:flex md:order-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>Modify Selections</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="algorithm">Algorithm</Label>
                      <Select value="aes">
                        <SelectTrigger id="algorithm">
                          <SelectValue placeholder="Select Algorithm" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="aes">AES</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="algorithm">Mode</Label>
                      <Select value="CBC">
                        <SelectTrigger id="mode">
                          <SelectValue placeholder="Select Mode" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="CBC">CBC</SelectItem>
                          <SelectItem value="CFB">CFB</SelectItem>
                          <SelectItem value="CTR">CTR</SelectItem>
                          <SelectItem value="OFB">OFB</SelectItem>
                          <SelectItem value="ECB">ECB</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="auth">Encrypt with</Label>
                      <RadioGroup id="auth" defaultValue="Passphrase">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Passphrase" id="option-one" />
                          <Label htmlFor="option-one">Passphrase</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Key" id="option-two" />
                          <Label htmlFor="option-two">Key</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button>Cancel</Button>
                    <Button>Deploy</Button>
                  </CardFooter>
                </Card>
              </aside>
            </main>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default App
