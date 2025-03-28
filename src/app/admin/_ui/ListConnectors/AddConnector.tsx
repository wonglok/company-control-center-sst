import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { putConnectionToken } from '@/actions/connectionTokens/putConnectionToken'
import { v4 } from 'uuid'
import { listConnectionToken } from '@/actions/connectionTokens/listConnectionToken'
import { useConnectorTokens } from './useConnectorTokens'
import { toast } from 'sonner'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function AddConnector() {
    let [name, setName] = React.useState(`Office Mac Mini`)
    return (
        <Card className='size-full'>
            <CardHeader>
                <CardTitle>Add AI Device</CardTitle>
                <CardDescription>Create Connection Link</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className='grid w-full items-center gap-4'>
                        <div className='flex flex-col space-y-1.5'>
                            <Label htmlFor='name'>Name</Label>
                            <Input
                                value={name}
                                onChange={(ev) => {
                                    setName(ev.target.value)
                                }}
                                id='name'
                                placeholder='Name of your project'
                            />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className='flex justify-end'>
                <Button
                    onClick={() => {
                        let itemID = `${v4()}`
                        let secret = `${v4()}`
                        putConnectionToken({
                            item: {
                                itemID: itemID,
                                secret: secret,
                                name: name,
                            },
                        }).then(() => {
                            //

                            listConnectionToken().then((data) => {
                                useConnectorTokens.setState({ tokens: data })
                            })

                            toast('Successfully added new connector to the account')
                        })
                    }}
                >
                    Create
                </Button>
            </CardFooter>
        </Card>
    )
}
