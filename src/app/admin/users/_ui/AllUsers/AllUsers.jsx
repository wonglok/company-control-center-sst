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
export function AllUsers() {
    let users = useUsers(r => r.users)

    useEffect(() => {
        // 

        //
    }, [])
    return (
        <Card className='size-full'>
            <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Admin Users</CardDescription>
            </CardHeader>
            <CardContent>
                {users && users.length === 0 && (
                    <>
                        <Alert>
                            <TerminalIcon></TerminalIcon>
                            <AlertTitle>Heads up!</AlertTitle>
                            <AlertDescription>Please create a new Token.</AlertDescription>
                        </Alert>
                    </>
                )}

                {users && users.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Status</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className='text-center'>Remove</TableHead>
                                <TableHead className='text-center'>Copy</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow key={user.itemID}>
                                <TableCell className='flex justify-center items-center flex-col'>

                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                )}
            </CardContent>
            <CardFooter className='flex justify-end'></CardFooter>
        </Card>
    )
}

// 