// @ts-nocheck

import { Button } from '@/components/ui/button'
import { Textarea } from './components/ui/textarea'
import { Label } from './components/ui/label'
import { Input } from './components/ui/input'
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
import { SavedKeysViewer } from './components/code-viewer'

const modeToTextMap = {
  CBC: CryptoJS.mode.CBC,
  CFB: CryptoJS.mode.CFB,
  CTR: CryptoJS.mode.CTR,
  OFB: CryptoJS.mode.OFB,
  ECB: CryptoJS.mode.ECB,
}

function App() {
  const [isOpen, setIsOpen] = useState(false)

  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [keyText, setKeyText] = useState('')
  const [ivText, setIvText] = useState('')
  const [mode, setMode] = useState('CBC')
  const [authMode, setAuthMode] = useState('Passphrase')
  const [error_message, setErrorMessage] = useState('')
  const [key_size, setKeySize] = useState('512')
  const [rsaMode, setRsaMode] = useState('sv')
  const [caMode, setCaMode] = useState('s')
  const [signedText, setSignedText] = useState('')
  const [savedKeyPairs, setSavedKeyPairs] = useState([])
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
          { bits: parseInt(key_size), workers: -1 },
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
    if (!outputText) {
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
    setSignedText('')
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

  const handleSignAndEnrypt = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!inputText) {
      clearTimeout(error_message_id)
      setErrorMessage('Please enter private key.')
      error_message_id = setTimeout(() => {
        setErrorMessage('')
      }, 3000)
      return
    }
    if (authMode === 'Passphrase' && !keyText) {
      clearTimeout(error_message_id)
      setErrorMessage('Please enter passphrase.')
      error_message_id = setTimeout(() => {
        setErrorMessage('')
      }, 3000)
      return
    }
    if (authMode === 'Key') {
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
    }
    if (authMode === 'Key') {
      if (ivText.length !== 32) {
        clearTimeout(error_message_id)
        setErrorMessage('IV length must be 16 bytes (32 hex characters)')
        error_message_id = setTimeout(() => {
          setErrorMessage('')
        }, 3000)
        return
      }
    }

    if (!outputText) {
      clearTimeout(error_message_id)
      setErrorMessage('Please text to encrypt.')
      error_message_id = setTimeout(() => {
        setErrorMessage('')
      }, 3000)
      return
    }

    const privateKey = forge.pki.privateKeyFromPem(inputText)
    const text_hash = CryptoJS.SHA512(outputText).toString()
    const md = forge.md.sha1.create()
    md.update(text_hash, 'utf8')
    const pss = forge.pss.create({
      md: forge.md.sha1.create(),
      mgf: forge.mgf.mgf1.create(forge.md.sha1.create()),
      saltLength: 20,
    })
    const signature = privateKey.sign(md, pss)
    console.log('signature ', forge.util.encode64(signature))

    const encrypted =
      authMode === 'Passphrase'
        ? AES.encrypt(outputText, keyText, {
            mode: modeToTextMap[mode],
          })
        : AES.encrypt(outputText, CryptoJS.enc.Hex.parse(keyText), {
            iv: CryptoJS.enc.Hex.parse(ivText),
            mode: modeToTextMap[mode],
          })

    console.log('encrypted', encrypted.toString())

    const encrypted_signed =
      encrypted.toString() + '||' + forge.util.encode64(signature)
    console.log('encrypted_signed', encrypted_signed)

    setSignedText(encrypted_signed)
  }

  const handleVerifyAndDecrypt = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!inputText) {
      clearTimeout(error_message_id)
      setErrorMessage('Please enter public key.')
      error_message_id = setTimeout(() => {
        setErrorMessage('')
      }, 3000)
      return
    }
    if (authMode === 'Passphrase' && !keyText) {
      clearTimeout(error_message_id)
      setErrorMessage('Please enter passphrase.')
      error_message_id = setTimeout(() => {
        setErrorMessage('')
      }, 3000)
      return
    }
    if (authMode === 'Key') {
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
    }
    if (authMode === 'Key') {
      if (ivText.length !== 32) {
        clearTimeout(error_message_id)
        setErrorMessage('IV length must be 16 bytes (32 hex characters)')
        error_message_id = setTimeout(() => {
          setErrorMessage('')
        }, 3000)
        return
      }
    }

    if (!outputText) {
      clearTimeout(error_message_id)
      setErrorMessage('Please text to encrypt.')
      error_message_id = setTimeout(() => {
        setErrorMessage('')
      }, 3000)
      return
    }

    const publicKey = forge.pki.publicKeyFromPem(inputText)
    const [encrypted, signature] = outputText.split('||')
    console.log('encrypted', encrypted)
    console.log('signature', signature)

    const decrypted =
      authMode === 'Passphrase'
        ? AES.decrypt(encrypted, keyText, {
            mode: modeToTextMap[mode],
          })
        : AES.decrypt(encrypted, CryptoJS.enc.Hex.parse(keyText), {
            iv: CryptoJS.enc.Hex.parse(ivText),
            mode: modeToTextMap[mode],
          })

    console.log('decrypted', decrypted.toString(CryptoJS.enc.Utf8))
    setSignedText(decrypted.toString(CryptoJS.enc.Utf8))

    const text_hash = CryptoJS.SHA512(
      decrypted.toString(CryptoJS.enc.Utf8),
    ).toString()
    const md = forge.md.sha1.create()
    md.update(text_hash, 'utf8')
    const pss = forge.pss.create({
      md: forge.md.sha1.create(),
      mgf: forge.mgf.mgf1.create(forge.md.sha1.create()),
      saltLength: 20,
    })
    const signature_decoded = forge.util.decode64(signature)

    try {
      const verified = publicKey.verify(
        md.digest().bytes(),
        signature_decoded,
        pss,
      )
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

  return (
    <>
      <div className="absolute right-5 top-5">
        <ModeToggle />
      </div>
      <h1 className="pt-10 text-center text-4xl font-bold text-gray-900 dark:text-gray-100">
        CSE451 - Project
      </h1>
      <div className="container h-full py-6">
        <Tabs defaultValue="ca">
          <TabsList className="grid w-full grid-cols-5 ">
            <TabsTrigger className="overflow-hidden" value="ca">
              Confidentiality + Authentication
            </TabsTrigger>
            <TabsTrigger className="overflow-hidden" value="gen">
              Generate Public/Private Key Pair
            </TabsTrigger>
            <TabsTrigger className="overflow-hidden" value="sv">
              RSA
            </TabsTrigger>
            <TabsTrigger value="ed" className="overflow-hidden">
              AES
            </TabsTrigger>
            <TabsTrigger className="overflow-hidden" value="sha">
              SHA512
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="ca"
            className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_350px]"
          >
            <Card className="flex flex-col space-y-4">
              <CardHeader>
                <CardTitle>Confidentiality + Authentication</CardTitle>
                <CardDescription>Enter text or select file.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <article className="flex flex-col space-y-4">
                  <div className="grid h-full gap-6 lg:grid-cols-2">
                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-1 flex-col space-y-2">
                        <Label htmlFor="input" className="text-lg">
                          {caMode === 's' ? 'Private Key' : 'Public key'} (PEM)
                        </Label>
                        <Textarea
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          id="input"
                          placeholder="Genereate a key pair and enter your key here. drag and drop is also supported."
                          className="flex-1 lg:min-h-[200px]"
                          onDrop={(e) => {
                            e.preventDefault()
                            const file = e.dataTransfer.files[0]
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              const text = event.target?.result
                              setInputText(text as string)
                            }
                            reader.readAsText(file)
                          }}
                          onDragOver={(e) => {
                            e.preventDefault()
                          }}
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
                          placeholder="Enter your passphrase or key here or drag and drop."
                          onDrop={(e) => {
                            e.preventDefault()
                            const file = e.dataTransfer.files[0]
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              const text = event.target?.result
                              setKeyText(text as string)
                            }
                            reader.readAsText(file)
                          }}
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
                          placeholder="Enter your IV here or drag and drop."
                          onDrop={(e) => {
                            e.preventDefault()
                            const file = e.dataTransfer.files[0]
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              const text = event.target?.result
                              setIvText(text as string)
                            }
                            reader.readAsText(file)
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-1 flex-col space-y-2">
                        <Label htmlFor="output" className="text-lg">
                          Input Text (UTF-8)
                        </Label>
                        <Textarea
                          value={outputText}
                          onChange={(e) => setOutputText(e.target.value)}
                          id="output"
                          placeholder="Select File or drag and drop."
                          className="flex-1 lg:min-h-[200px]"
                          onDrop={(e) => {
                            e.preventDefault()
                            const file = e.dataTransfer.files[0]
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              const text = event.target?.result
                              setOutputText(text as string)
                            }
                            reader.readAsText(file)
                          }}
                        />
                        <Label htmlFor="signed" className="text-lg">
                          {caMode === 's'
                            ? 'Encrypted and Signed'
                            : 'Decrypted'}{' '}
                          Text
                        </Label>
                        <Textarea
                          value={signedText}
                          onChange={(e) => setSignedText(e.target.value)}
                          id="signed"
                          placeholder="Output will be displayed here"
                          className=" lg:min-h-[200px]"
                          draggable={true}
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
                  className={clsx('text-xl font-bold', {
                    'text-red-500': error_message.startsWith('I'),
                    'text-green-500': error_message.startsWith('V'),
                  })}
                >
                  {error_message}
                </p>
              </CardFooter>
            </Card>
            <aside className=" w-[350px] flex-col gap-2 sm:flex md:order-2">
              <div className="grid w-full max-w-sm cursor-pointer items-center gap-1.5 rounded-lg border-2 border-dashed p-2 hover:border-gray-500">
                <Label htmlFor="file" className="text-lg">
                  Click to select file or start Typing away
                </Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    const reader = new FileReader()
                    reader.onload = function (e) {
                      const text = e.target?.result
                      setOutputText(text as string)
                    }
                    reader.readAsText(file)
                  }}
                />
              </div>
              <div className="grid w-full max-w-sm cursor-pointer items-center gap-1.5 rounded-lg border-2 border-dashed p-2 hover:border-gray-500">
                <Label htmlFor="modal" className="text-lg">
                  Click to select Saved Key Pair or generate a new one to save
                </Label>
                <SavedKeysViewer savedKeyPairs={savedKeyPairs} />
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Modify Selections</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="ca">
                      Select Sign&Encrypt or Decrypt&Verify
                    </Label>
                    <Select value={caMode} onValueChange={(e) => setCaMode(e)}>
                      <SelectTrigger id="ca">
                        <SelectValue placeholder="Select Mode" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="s">Sign&Encrypt</SelectItem>
                        <SelectItem value="v">Decrypt&Verify</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="algorithm">Encryption Algorithm</Label>
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
                    <Label htmlFor="auth">Use</Label>
                    <RadioGroup
                      id="auth"
                      defaultValue={authMode}
                      onValueChange={(e) => setAuthMode(e)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Passphrase" id="option-one" />
                        <Label htmlFor="option-one">Passphrase</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Key" id="option-two" />
                        <Label htmlFor="option-two">Key & IV</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex space-x-2">
                    {caMode === 's' ? (
                      <Button onClick={handleSignAndEnrypt}>
                        Sign and Encrypt
                      </Button>
                    ) : (
                      <Button onClick={handleVerifyAndDecrypt}>
                        Verify and Decrypt
                      </Button>
                    )}
                  </div>
                  <Button variant="destructive" onClick={handleClear}>
                    Clear
                  </Button>
                </CardFooter>
              </Card>
            </aside>
          </TabsContent>

          <TabsContent
            value="ed"
            className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_350px]"
          >
            <Card className="flex flex-col space-y-4">
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
            <aside className=" w-[350px] flex-col gap-2 sm:flex md:order-2">
              <div className="grid w-full max-w-sm cursor-pointer items-center gap-1.5 rounded-lg border-2 border-dashed p-2 hover:border-gray-500">
                <Label htmlFor="file" className="text-lg">
                  Click to select file or start Typing away
                </Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    const reader = new FileReader()
                    reader.onload = function (e) {
                      const text = e.target?.result
                      setInputText(text as string)
                    }
                    reader.readAsText(file)
                  }}
                />
              </div>
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
                      defaultValue={authMode}
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
                  <div className="flex space-x-2">
                    <Button onClick={handleEncrypt}>Encrypt</Button>
                    <Button onClick={handleDecrypt}>Decrypt</Button>
                  </div>
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
              <CardContent>
                <article className="flex flex-col space-y-4">
                  <div className="grid h-full gap-6 lg:grid-cols-2">
                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-1 flex-col space-y-2">
                        <Label htmlFor="priv-key" className="text-lg">
                          Private Key (PEM)
                        </Label>
                        <Textarea
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          id="priv-key"
                          placeholder="Your private key will be displayed here or drag and drop."
                          className="lg:min-h-[400px]"
                          onDrag={(e) => {
                            e.preventDefault()
                            const file = e.dataTransfer.files[0]
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              const text = event.target?.result
                              setInputText(text as string)
                            }
                            reader.readAsText(file)
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-1 flex-col space-y-2">
                        <Label htmlFor="pub-key" className="text-lg">
                          Public Key (PEM)
                        </Label>
                        <Textarea
                          value={outputText}
                          onChange={(e) => setOutputText(e.target.value)}
                          id="pub-key"
                          placeholder="Your public key will be displayed here or drag and drop."
                          className=" lg:min-h-[400px]"
                          onDrag={(e) => {
                            e.preventDefault()
                            const file = e.dataTransfer.files[0]
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              const text = event.target?.result
                              setOutputText(text as string)
                            }
                            reader.readAsText(file)
                          }}
                          onDragEnd={
                            (e) => {
                              e.preventDefault()
                            } /* required to prevent default behavior */
                          }
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
                    'text-xl font-bold',
                    error_message.startsWith('S')
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
                  <div className="flex space-x-2">
                    <Button onClick={handleGenerate}>Generate</Button>
                    <Button
                      onClick={() => {
                        if (inputText && outputText) {
                          setSavedKeyPairs([
                            ...savedKeyPairs,
                            { private: inputText, public: outputText },
                          ])
                          clearTimeout(error_message_id)
                          setErrorMessage('Saved')
                          error_message_id = setTimeout(() => {
                            setErrorMessage('')
                          }, 3000)
                        }
                      }}
                    >
                      Save
                    </Button>
                  </div>
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
                          Private Key (PEM)
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
                          {rsaMode === 'sv'
                            ? 'Text to Sign Or Verify'
                            : 'Input'}
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
                          Public Key (PEM)
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
            <aside className=" w-[350px] flex-col gap-2 sm:flex md:order-2">
              <div className="grid w-full max-w-sm cursor-pointer items-center gap-1.5 rounded-lg border-2 border-dashed p-2 hover:border-gray-500">
                <Label htmlFor="file" className="text-lg">
                  Click to select file or start Typing away
                </Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    const reader = new FileReader()
                    reader.onload = function (e) {
                      const text = e.target?.result
                      setKeyText(text as string)
                    }
                    reader.readAsText(file)
                  }}
                />
              </div>
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
                        <SelectItem value="rsa">
                          {rsaMode === 'sv' ? 'RSASSA-PSS' : 'RSA'}
                        </SelectItem>
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

          <TabsContent
            value="sha"
            className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_350px]"
          >
            <Card>
              <CardHeader>
                <CardTitle>SHA512</CardTitle>
                <CardDescription>
                  Enter the text to generate SHA512 hash.
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
                          placeholder="Text to generate SHA512 hash"
                          className="flex-1 lg:min-h-[200px]"
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
            <aside className=" w-[350px] flex-col gap-2 sm:flex md:order-2">
              <div className="grid w-full max-w-sm cursor-pointer items-center gap-1.5 rounded-lg border-2 border-dashed p-2 hover:border-gray-500">
                <Label htmlFor="file" className="text-lg">
                  Click to select file or start Typing away
                </Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    const reader = new FileReader()
                    reader.onload = function (e) {
                      const text = e.target?.result
                      setInputText(text as string)
                    }
                    reader.readAsText(file)
                  }}
                />
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Modify Selections</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="algorithm">Algorithm</Label>
                    <Select value="sha512">
                      <SelectTrigger id="algorithm">
                        <SelectValue placeholder="Select Algorithm" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="sha512">SHA512</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      if (!inputText) return
                      const hash = CryptoJS.SHA512(inputText)
                      console.log('hash', hash.toString())
                      setOutputText(hash.toString())
                    }}
                  >
                    Generate
                  </Button>
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
