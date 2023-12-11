import { Button } from '@/components/ui/button'
import { Textarea } from './components/ui/textarea'
import { Label } from './components/ui/label'
import { ModeToggle } from './components/mode.toggle'
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
import AES from 'crypto-js/aes'
import CryptoJS from 'crypto-js'
import forge from 'node-forge'

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
    <div>
      <Button
        onClick={() => {
          const encrypted = AES.encrypt(
            'ana ba7abk ya bedonzy, yours Hala',
            'meqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdad',
            {
              mode: CryptoJS.mode.CFB,
            },
          )
          console.log('[encrypted]', encrypted.toString())
          console.log('[ciphertext]', encrypted.ciphertext.toString())
          console.log('[salt]', encrypted.salt.toString())
          console.log('[iv]', encrypted.iv.toString())
          console.log('[key]', encrypted.key.toString())
          const decrypted = AES.decrypt(
            encrypted.toString(),
            'meqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdadmeqdad',
            {
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
          // const privateKey = forge.pki.privateKeyFromPem(private_rsa)
          // const publicKey = forge.pki.publicKeyFromPem(public_rsa)
          console.log(forge.pki.publicKeyToRSAPublicKeyPem(publicKey))
          console.log(forge.pki.privateKeyToPem(privateKey))

          /*           const encrypted = publicKey.encrypt('meqdad')
          console.log(forge.util.encode64(encrypted))
          const decrypted = privateKey.decrypt(encrypted)
          console.log(decrypted) */

          const md = forge.md.sha512.create()
          md.update('HALAHALA', 'utf8')
          const hash = md.digest()
          console.log('hash ', hash.toHex())

          const signature = privateKey.sign(md)

          console.log(forge.util.encode64(signature))
          const verified = publicKey.verify(md.digest().bytes(), signature)
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

      <div className="absolute right-5 top-5">
        <ModeToggle />B
      </div>
      <h1 className="pt-10 text-center text-4xl font-bold text-gray-900 dark:text-gray-100">
        CSE451 - Project
      </h1>
      <div className="container h-full py-6">
        <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
          <aside className=" flex-col space-y-4 pt-5 sm:flex md:order-2">
            <Card className="w-[350px]">
              <CardHeader>
                <CardTitle>Select</CardTitle>
                <CardDescription>Please select onichan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Name of your project" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="algorithm">Algorithm</Label>
                    <Select value='aes'>
                      <SelectTrigger id="algorithm">
                        <SelectValue placeholder="Select Algorithm" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="aes">AES</SelectItem>
                        <SelectItem value="des">DES</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button>Cancel</Button>
                <Button>Deploy</Button>
              </CardFooter>
            </Card>
          </aside>
          <div className="md:order-1">
            <div className="flex flex-col space-y-4">
              <div className="grid h-full gap-6 lg:grid-cols-2">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-1 flex-col space-y-2">
                    <Label htmlFor="input">Input</Label>
                    <Textarea
                      id="input"
                      placeholder="We is going to the market."
                      className="flex-1 lg:min-h-[580px]"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="instructions">Instructions</Label>
                    <Textarea
                      id="instructions"
                      placeholder="Fix the grammar."
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-1 flex-col space-y-2">
                    <Label htmlFor="output">Output</Label>
                    <Textarea
                      id="output"
                      placeholder="We is going to the market."
                      className="flex-1 lg:min-h-[580px]"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button>Submit</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
