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

function App() {
  const JsonFormatter = {
    stringify: function (cipherParams) {
      // create json object with ciphertext
      const jsonObj = {
        ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64),
      }
      // optionally add iv or salt
      if (cipherParams.iv) {
        jsonObj.iv = cipherParams.iv.toString()
      }
      if (cipherParams.salt) {
        jsonObj.s = cipherParams.salt.toString()
      }
      // stringify json object
      return JSON.stringify(jsonObj)
    },
    parse: function (jsonStr) {
      // parse json string
      const jsonObj = JSON.parse(jsonStr)
      // extract ciphertext from json object, and create cipher params object
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct),
      })
      // optionally extract iv or salt
      if (jsonObj.iv) {
        cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv)
      }
      if (jsonObj.s) {
        cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s)
      }
      return cipherParams
    },
  }

  const encrypted = CryptoJS.AES.encrypt('Message', 'Secret Passphrase', {
    format: JsonFormatter,
  })
  console.log(encrypted)

  const decrypted = CryptoJS.AES.decrypt(encrypted, 'Secret Passphrase', {
    format: JsonFormatter,
  })
  console.log(decrypted.toString())

  return (
    <div>
      <Button
        onClick={() => {
          const encrypted = AES.encrypt(
            'ana ba7abk ya bedonzy, yours Hala',
            'meqdad',
          )
          console.log('[encrypted]', encrypted.toString())
          console.log('[ciphertext]', encrypted.ciphertext.toString())
          console.log('[salt]', encrypted.salt.toString())
          console.log('[iv]', encrypted.iv.toString())
          console.log('[key]', encrypted.key.toString())
          const decrypted = AES.decrypt(
            encrypted.toString(),
            'meqdad',
          )
          console.log('[decrypted]', decrypted.toString(CryptoJS.enc.Utf8))
        }}
      >
        encrypt
      </Button>
      <Button
        onClick={() => {
          console.log(
            AES.decrypt(
              'U2FsdGVkX19rQBFPpjnHconstwTd0aldHN66NRI3t/2FA+4cfSWbf+LSXbk81fJv1E5iLrnS2Hj2P54EjkVVdmVg==',
              'meqdad',
            ).toString(),
          )
        }}
      >
        decrypt
      </Button>
      <div className="absolute right-5 top-5">
        <ModeToggle />
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
                    <Select>
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
                <Button constiant="outline">Cancel</Button>
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
