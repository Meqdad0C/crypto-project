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
import { useState } from 'react'
import clsx from 'clsx'

const ButtonWrapper = ({ children }: { children: React.ReactNode }) => (
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
          },
        )
        console.log('[encrypted]', encrypted.toString())
        // console.log('[salt]', encrypted.salt.toString())
        console.log('[iv]', encrypted.iv.toString())
        console.log('[key]', encrypted.key.toString())
        const decrypted = AES.decrypt(
          encrypted.toString(),
          CryptoJS.enc.Hex.parse('000102030405060708090a0b0c0d0e0f'),
          {
            iv: CryptoJS.enc.Hex.parse('101112131415161718191a1b1c1d1e1f'),
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
  const [algorithm, setAlgorithm] = useState('aes')
  const [mode, setMode] = useState('CBC')
  const [authMode, setAuthMode] = useState('Passphrase')
  const [error_message, setErrorMessage] = useState('')
  const [key_size, setKeySize] = useState('512')
  let error_message_id

  const handleEncrypt = (e) => {
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

  const handleDecrypt = (e) => {
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

  const handleGenerate = async (e) => {
    e.preventDefault()
    console.log('key_size', key_size);

    const rsa = forge.pki.rsa
    function generateKeyPair() {
      return new Promise((resolve, reject) => {
        rsa.generateKeyPair({ bits: parseInt(key_size), workers: 2 }, function (
          err,
          keypair,
        ) {
          if (err) reject(err)
          resolve(keypair)
        })
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
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            id="input"
                            placeholder="Text to encrypt or decrypt"
                            className="flex-1 lg:min-h-[200px]"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          {authMode === 'Passphrase' ? (
                            <Label htmlFor="passphrase">Passphrase (Hex)</Label>
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
                  </CardFooter>
                </Card>
              </aside>
            </main>
          </TabsContent>
          <TabsContent value="gen">
            <main className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
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
                          <SelectItem value="4096">4096</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button onClick={handleGenerate}>Generate</Button>
                  </CardFooter>
                </Card>
              </aside>
            </main>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default App
