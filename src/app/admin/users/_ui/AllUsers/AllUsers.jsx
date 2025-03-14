import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    // TableCaption,
    // TableFooter,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
// import { useEffect } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { TerminalIcon, } from 'lucide-react'
import { useUsers } from './useUsers'
import { useEffect } from 'react'
import { listUsers } from '@/actions/users/listUsers'
import { Button } from '@/components/ui/button'
import { getMySelf } from '@/actions/getMySelf'
import { removeUser } from '@/actions/users/removeUser'
export function AllUsers() {
    let users = useUsers(r => r.users)
    let loading = useUsers(r => r.loading)
    let myself = useUsers(r => r.myself)

    useEffect(() => {
        // 

        useUsers.setState({ loading: true })

        listUsers({}).then((data) => {
            console.log(data)
            useUsers.setState({ loading: false, users: data })
        })

        getMySelf().then((myself) => {
            useUsers.setState({ myself: myself })
        })

        //
    }, [])
    return (
        <Card className='size-full'>
            <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Admin Users</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? <>
                    <div>Loading...</div>
                </> : <>
                    {users && users.length === 0 && (
                        <>
                            <Alert>
                                <TerminalIcon></TerminalIcon>
                                <AlertTitle>Oops...</AlertTitle>
                                <AlertDescription>No users found / loading...</AlertDescription>
                            </Alert>
                        </>
                    )}

                    {users && users.length > 0 && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead className='text-center'>Remove</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => {
                                    return <TableRow key={user.itemID}>
                                        <TableCell className=''>
                                            {user.role}
                                        </TableCell>
                                        <TableCell className=''>
                                            {user.username}
                                        </TableCell>
                                        <TableCell className='text-center'>
                                            <Button disabled={user.username === myself?.username} variant={'destructive'} onClick={() => {
                                                if (window.confirm('remove user?')) {

                                                    removeUser({ item: { itemID: user.itemID } }).then(() => {
                                                        listUsers({}).then((data) => {
                                                            console.log(data)
                                                            useUsers.setState({ loading: false, users: data })
                                                        })
                                                    })
                                                    //

                                                }
                                            }}>Remove</Button>
                                        </TableCell>
                                    </TableRow>
                                })}
                            </TableBody>
                        </Table>
                    )}
                </>}

            </CardContent>
            <CardFooter className='flex justify-end'></CardFooter>
        </Card>
    )
}

// 