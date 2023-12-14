// @ts-nocheck

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
export function SavedKeysViewer({ savedKeyPairs }) {
  console.log(savedKeyPairs)
  const { toast } = useToast()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View Keys</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Saved Keys</DialogTitle>
          <DialogDescription>
            You can use the following keys to start. You can also create yours.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <ScrollArea className="h-72  rounded-md border">
            {savedKeyPairs.map((keyPair, index) => (
              <div key={index}>
                <p className="p-2 text-lg font-medium text-gray-900">
                  key number {index}
                </p>
                <div className="flex flex-col  gap-4 rounded-md bg-gray-100 p-2">
                  <div className="flex flex-col items-center justify-between gap-4">
                    <p className="text-sm font-medium text-gray-900">
                      Public Key
                    </p>
                    <p className="text-sm text-gray-500">{keyPair.public}</p>
                    <Button
                      className="px-2 py-1 text-sm"
                      onClick={() => {
                        navigator.clipboard.writeText(keyPair.public)
                        toast({
                          title: 'Public Key Copied',
                        })
                      }}
                    >
                      Copy Public Key {index}
                    </Button>
                    <Separator className="my-2" />

                    <div className="flex flex-col items-center justify-between gap-4">
                      <p className="text-sm font-medium text-gray-900">
                        Private Key
                      </p>
                      <p className="text-sm text-gray-500">{keyPair.private}</p>
                      <Button
                        className="px-2 py-1 text-sm"
                        onClick={() => {
                          navigator.clipboard.writeText(keyPair.private)
                          toast({
                            title: 'Private Key Copied',
                          })
                        }}
                      >
                        Copy Private Key {index}
                      </Button>
                    </div>
                  </div>
                </div>
                <Separator className="my-2" />
              </div>
            ))}
          </ScrollArea>

          <div>
            <p className="text-sm text-muted-foreground">
              Your Keys will be saved in your browser. You can use them later.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
