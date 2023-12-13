// @ts-nocheck

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
import { useState } from 'react'
import clsx from 'clsx'

const modeToTextMap = {
  CBC: CryptoJS.mode.CBC,
  CFB: CryptoJS.mode.CFB,
  CTR: CryptoJS.mode.CTR,
  OFB: CryptoJS.mode.OFB,
  ECB: CryptoJS.mode.ECB,
}

function App() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [keyText, setKeyText] = useState('')
  const [ivText, setIvText] = useState('')
  const [mode, setMode] = useState('CBC')
  const [authMode, setAuthMode] = useState('Passphrase')
  const [error_message, setErrorMessage] = useState('')
  const [key_size, setKeySize] = useState('512')
  const [rsaMode, setRsaMode] = useState('sv')
  let error_message_id: string | number | NodeJS.Timeout | undefined

  const handleEncrypt = (e: { preventDefault: () => void }) => {
    console.log('input', inputText)
    console.log('key', keyText)
    console.log('iv', ivText)
    console.log('mode', mode)
    console.log('authMode', authMode)

    e.preventDefault()
    if (!inputText) return
    if (authMode === 'Passphrase') {
      const encrypted = AES.encrypt(inputText, keyText, {
        mode: modeToTextMap[mode],
      })
      console.log('encrypted', encrypted.toString())
      console.log('iv', encrypted.iv.toString())
      console.log('key', encrypted.key.toString())
      setOutputText(encrypted.toString())
    } else {
      if (
        keyText.length !== 32 &&
        keyText.length !== 48 &&
        keyText.length !== 64
      ) {
        clearTimeout(error_message_id)
        setErrorMessage(
          'Key length must be between 16, 24 or 32 bytes (32, 48 or 64 hex characters)',
        )
        error_message_id = setTimeout(() => {
          setErrorMessage('')
        }, 3000)
        return
      }
      if (ivText.length !== 32) {
        clearTimeout(error_message_id)
        setErrorMessage('IV length must be 16 bytes (32 hex characters)')
        error_message_id = setTimeout(() => {
          setErrorMessage('')
        }, 3000)
        return
      }
      const encrypted = AES.encrypt(
        inputText,
        CryptoJS.enc.Hex.parse(keyText),
        {
          iv: CryptoJS.enc.Hex.parse(ivText),
          mode: modeToTextMap[mode],
        },
      )
      console.log('encrypted', encrypted.toString())
      // console.log('iv', encrypted.iv.toString())
      console.log('key', encrypted.key.toString())
      setOutputText(encrypted.toString())
    }
  }

  const handleDecrypt = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!inputText) return
    if (authMode === 'Passphrase') {
      const decrypted = AES.decrypt(inputText, keyText, {
        mode: modeToTextMap[mode],
      })
      console.log('decrypted', decrypted.toString(CryptoJS.enc.Utf8))
      setOutputText(decrypted.toString(CryptoJS.enc.Utf8))
    } else {
      if (
        keyText.length !== 32 &&
        keyText.length !== 48 &&
        keyText.length !== 64
      ) {
        clearTimeout(error_message_id)
        setErrorMessage(
          'Key length must be between 16, 24 or 32 bytes (32, 48 or 64 hex characters)',
        )
        error_message_id = setTimeout(() => {
          setErrorMessage('')
        }, 3000)
        return
      }
      const decrypted = AES.decrypt(
        inputText,
        CryptoJS.enc.Hex.parse(keyText),
        {
          iv: CryptoJS.enc.Hex.parse(ivText),
          mode: modeToTextMap[mode],
        },
      )
      console.log('decrypted', decrypted.toString(CryptoJS.enc.Utf8))
      setOutputText(decrypted.toString(CryptoJS.enc.Utf8))
    }
  }

  const handleGenerate = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    console.log('key_size', key_size)

    const rsa = forge.pki.rsa
    function generateKeyPair() {
      return new Promise((resolve, reject) => {
        rsa.generateKeyPair(
          { bits: parseInt(key_size), workers: 2 },
          function (err, keypair) {
            if (err) reject(err)
            resolve(keypair)
          },
        )
      })
    }
    const keyPromise = generateKeyPair()
    const keypair = await keyPromise
    const privateKey = keypair.privateKey
    const publicKey = keypair.publicKey
    const my_pub_key = forge.pki.publicKeyToPem(publicKey)
    const my_private_key = forge.pki.privateKeyToPem(privateKey)
    console.log(my_pub_key)
    console.log(my_private_key)
    setOutputText(my_pub_key)
    setInputText(my_private_key)
  }

  const handleSign = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!inputText) {
      clearTimeout(error_message_id)
      setErrorMessage('Please enter private key.')
      error_message_id = setTimeout(() => {
        setErrorMessage('')
      }, 3000)
      return
    }
    if (!keyText) {
      clearTimeout(error_message_id)
      setErrorMessage('Please enter text to sign.')
      error_message_id = setTimeout(() => {
        setErrorMessage('')
      }, 3000)
      return
    }

    const pk = inputText
    const privateKey = forge.pki.privateKeyFromPem(pk)
    const md = forge.md.sha1.create()
    md.update(keyText, 'utf8')
    const pss = forge.pss.create({
      md: forge.md.sha1.create(),
      mgf: forge.mgf.mgf1.create(forge.md.sha1.create()),
      saltLength: 20,
    })

    console.log('text', keyText)

    const signature = privateKey.sign(md, pss)
    console.log('signature ', forge.util.encode64(signature))

    setIvText(forge.util.encode64(signature))
  }

  const handleVerify = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!inputText) {
      clearTimeout(error_message_id)
      setErrorMessage('Please enter public key.')
      error_message_id = setTimeout(() => {
        setErrorMessage('')
      }, 3000)
      return
    }
    if (!keyText) {
      clearTimeout(error_message_id)
      setErrorMessage('Please enter text to verify.')
      error_message_id = setTimeout(() => {
        setErrorMessage('')
      }, 3000)
      return
    }
    if (!ivText) {
      clearTimeout(error_message_id)
      setErrorMessage('Please enter signature.')
      error_message_id = setTimeout(() => {
        setErrorMessage('')
      }, 3000)
      return
    }

    const publicKey = forge.pki.publicKeyFromPem(outputText)
    const md = forge.md.sha1.create()
    md.update(keyText, 'utf8')
    const pss = forge.pss.create({
      md: forge.md.sha1.create(),
      mgf: forge.mgf.mgf1.create(forge.md.sha1.create()),
      saltLength: 20,
    })
    const signature = forge.util.decode64(ivText)
    try {
      const verified = publicKey.verify(md.digest().bytes(), signature, pss)
      console.log('is verified', verified)

      setErrorMessage(verified ? 'Verified' : 'Invalid Signature')
      clearTimeout(error_message_id)
      error_message_id = setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    } catch (err) {
      console.log(err)
      setErrorMessage('Invalid Signature')
      clearTimeout(error_message_id)
      error_message_id = setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  const handleClear = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setInputText('')
    setOutputText('')
    setKeyText('')
    setIvText('')
    setErrorMessage('')
  }

  const handleRsaEncrypt = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!inputText) {
      clearTimeout(error_message_id)
      setErrorMessage('Please enter public key.')
      error_message_id = setTimeout(() => {
        setErrorMessage('')
      }, 3000)
      return
    }
    if (!keyText) {
      clearTimeout(error_message_id)
      setErrorMessage('Please enter text to encrypt.')
      error_message_id = setTimeout(() => {
        setErrorMessage('')
      }, 3000)
      return
    }

    const publicKey = forge.pki.publicKeyFromPem(outputText)
    const encrypted = publicKey.encrypt(keyText)
    console.log('encrypted', forge.util.encode64(encrypted))
    setIvText(forge.util.encode64(encrypted))
  }

  const handleRsaDecrypt = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!inputText) {
      clearTimeout(error_message_id)
      setErrorMessage('Please enter private key.')
      error_message_id = setTimeout(() => {
        setErrorMessage('')
      }, 3000)
      return
    }
    if (!keyText) {
      clearTimeout(error_message_id)
      setErrorMessage('Please enter text to decrypt.')
      error_message_id = setTimeout(() => {
        setErrorMessage('')
      }, 3000)
      return
    }

    const privateKey = forge.pki.privateKeyFromPem(inputText)
    console.log('input', keyText)
    try {
      const decrypted = privateKey.decrypt(forge.util.decode64(keyText))
      console.log('decrypted', decrypted)
      setIvText(decrypted)
    } catch (err) {
      console.log(err)
      setErrorMessage('Invalid Input')
      clearTimeout(error_message_id)
      error_message_id = setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  return (
    <>
      <div className="absolute right-5 top-5">
        <ModeToggle />
      </div>
      <h1 className="pt-10 text-center text-4xl font-bold text-gray-900 dark:text-gray-100">
        CSE451 - Project
      </h1>
      <div className="container h-full py-6">
        <Tabs defaultValue="ed">
          <TabsList className="grid w-full grid-cols-3 overflow-hidden">
            <TabsTrigger value="ed">Encrypt & Decrypt</TabsTrigger>
            <TabsTrigger value="gen">
              Generate Public/Private Key Pair
            </TabsTrigger>
            <TabsTrigger value="sv">
              Sign & Verify Or Encrypt & Decrypt
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="ed"
            className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_350px]"
          >
            <Card>
              <CardHeader>
                <CardTitle>Encrypt & Decrypt</CardTitle>
                <CardDescription>
                  Select the algorithm and enter the text to encrypt or decrypt.
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
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          id="input"
                          placeholder="Text to encrypt or decrypt"
                          className="flex-1 lg:min-h-[200px]"
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        {authMode === 'Passphrase' ? (
                          <Label htmlFor="passphrase">Passphrase</Label>
                        ) : (
                          <Label htmlFor="key">Key (Hex)</Label>
                        )}
                        <Textarea
                          id="key"
                          value={keyText}
                          onChange={(e) => setKeyText(e.target.value)}
                          placeholder="Enter your passphrase or key here."
                        />
                      </div>

                      <div
                        className={clsx('flex flex-col space-y-2', {
                          'pointer-events-none  opacity-0':
                            authMode === 'Passphrase' || mode === 'ECB',
                        })}
                      >
                        <Label htmlFor="iv">IV (Hex)</Label>
                        <Textarea
                          id="iv"
                          value={ivText}
                          onChange={(e) => setIvText(e.target.value)}
                          placeholder="Enter your IV here."
                        />
                      </div>
                    </div>
                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-1 flex-col space-y-2">
                        <Label htmlFor="output" className="text-lg">
                          Output
                        </Label>
                        <Textarea
                          value={outputText}
                          onChange={(e) => setOutputText(e.target.value)}
                          id="output"
                          placeholder="Output will be displayed here"
                          className="flex-1 lg:min-h-[200px]"
                        />
                      </div>
                    </div>
                  </div>
                </article>
              </CardContent>
              <CardFooter className="flex justify-between">
                {/*                   <Button>Encrypt </Button>
                  <Button>Decrypt</Button> */}
                <p className=" text-xl font-bold text-red-500">
                  {error_message}
                </p>
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
                    <Select value={mode} onValueChange={(e) => setMode(e)}>
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
                    <RadioGroup
                      id="auth"
                      defaultValue="Passphrase"
                      onValueChange={(e) => setAuthMode(e)}
                    >
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
                  <Button onClick={handleEncrypt}>Encrypt</Button>
                  <Button onClick={handleDecrypt}>Decrypt</Button>
                  <Button variant="destructive" onClick={handleClear}>
                    Clear
                  </Button>
                </CardFooter>
              </Card>
            </aside>
          </TabsContent>

          <TabsContent
            value="gen"
            className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_350px]"
          >
            <Card>
              <CardHeader>
                <CardTitle>Generate Public/Private Key Pair</CardTitle>
                <CardDescription>
                  Generate a public/private key pair using RSA.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <article className="flex flex-col space-y-4">
                  <div className="grid h-full gap-6 lg:grid-cols-2">
                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-1 flex-col space-y-2">
                        <Label htmlFor="priv-key" className="text-lg">
                          Private Key
                        </Label>
                        <Textarea
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          id="priv-key"
                          placeholder="Your private key will be displayed here"
                          className="lg:min-h-[400px]"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-1 flex-col space-y-2">
                        <Label htmlFor="pub-key" className="text-lg">
                          Public Key
                        </Label>
                        <Textarea
                          value={outputText}
                          onChange={(e) => setOutputText(e.target.value)}
                          id="pub-key"
                          placeholder="Your public key will be displayed here"
                          className=" lg:min-h-[400px]"
                        />
                      </div>
                    </div>
                  </div>
                </article>
              </CardContent>
              <CardFooter className="flex justify-between">
                {/*                   <Button>Encrypt </Button>
                  <Button>Decrypt</Button> */}
                <p className=" text-xl font-bold text-red-500">
                  {error_message}
                </p>
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
                    <Label htmlFor=" algorithm">Algorithm</Label>
                    <Select value="rsa">
                      <SelectTrigger id="algorithm">
                        <SelectValue placeholder="Select Algorithm" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="rsa">RSA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="key-size">Key Size</Label>
                    <Select
                      onValueChange={(e) => setKeySize(e)}
                      value={key_size}
                    >
                      <SelectTrigger id="key-size">
                        <SelectValue placeholder="Select Key Size" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="512">512</SelectItem>
                        <SelectItem value="1024">1024</SelectItem>
                        <SelectItem value="2048">2048</SelectItem>
                        <SelectItem value="3072">3072</SelectItem>
                        <SelectItem value="4096">4096</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button onClick={handleGenerate}>Generate</Button>
                  <Button variant="destructive" onClick={handleClear}>
                    Clear
                  </Button>
                </CardFooter>
              </Card>
            </aside>
          </TabsContent>

          <TabsContent
            value="sv"
            className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_350px]"
          >
            <Card>
              <CardHeader>
                <CardTitle>Sign & Verify</CardTitle>
                <CardDescription>
                  Sign and verify a message using RSA.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <article className="flex flex-col space-y-4">
                  <div className="grid h-full gap-6 lg:grid-cols-2">
                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-1 flex-col space-y-2">
                        <Label htmlFor="input" className="text-lg">
                          Private Key
                        </Label>
                        <Textarea
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          id="input"
                          placeholder="Enter your private key here."
                          className="flex-1 lg:min-h-[200px]"
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="key" className="text-lg">
                          {rsaMode === 'sv' ? 'Text to Sign' : 'Input'}
                        </Label>
                        <Textarea
                          id="key"
                          value={keyText}
                          onChange={(e) => setKeyText(e.target.value)}
                          placeholder="Enter your text to sign here."
                          className="flex-1 lg:min-h-[200px]"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-1 flex-col space-y-2">
                        <Label htmlFor="output" className="text-lg">
                          Public Key
                        </Label>
                        <Textarea
                          value={outputText}
                          onChange={(e) => setOutputText(e.target.value)}
                          id="output"
                          placeholder="Enter your public key here."
                          className="flex-1 lg:min-h-[200px]"
                        />
                        <Label htmlFor="iv" className="text-lg">
                          {rsaMode === 'sv' ? 'Signature' : 'Output'}
                        </Label>
                        <Textarea
                          id="iv"
                          value={ivText}
                          onChange={(e) => setIvText(e.target.value)}
                          placeholder="Signature will be displayed here."
                          className="flex-1 lg:min-h-[200px]"
                        />
                      </div>
                    </div>
                  </div>
                </article>
              </CardContent>
              <CardFooter className="flex justify-between">
                {/*                   <Button>Encrypt </Button>
                  <Button>Decrypt</Button> */}
                <p
                  className={clsx(
                    ' text-xl font-bold',
                    error_message.startsWith('V')
                      ? 'text-green-500'
                      : 'text-red-500',
                  )}
                >
                  {error_message}
                </p>
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
                    <Select value="rsa">
                      <SelectTrigger id="algorithm">
                        <SelectValue placeholder="Select Algorithm" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="rsa">RSASSA-PSS</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="mode">Select functionality</Label>
                      <RadioGroup
                        id="mode"
                        defaultValue={rsaMode}
                        onValueChange={(e) => setRsaMode(e)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sv" id="option-one" />
                          <Label htmlFor="option-one">Sign & Verify</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="ed" id="option-two" />
                          <Label htmlFor="option-two">Encrypt & Decrypt</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex space-x-2">
                    <Button
                      onClick={rsaMode === 'sv' ? handleSign : handleRsaEncrypt}
                    >
                      {rsaMode === 'sv' ? 'Sign' : 'Encrypt'}
                    </Button>
                    <Button
                      onClick={
                        rsaMode === 'sv' ? handleVerify : handleRsaDecrypt
                      }
                    >
                      {rsaMode === 'sv' ? 'Verify' : 'Decrypt'}
                    </Button>
                  </div>
                  <Button variant="destructive" onClick={handleClear}>
                    Clear
                  </Button>
                </CardFooter>
              </Card>
            </aside>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default App
