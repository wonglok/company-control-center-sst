import { resetPassword } from "@/actions/users/resetPassword"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRef, useState } from "react"
import { toast } from "sonner"

export function ResetPW({ user }) {
    let ref = useRef()
    let [value, setValue] = useState('')
    let onSubmit = (ev) => {
        ev.preventDefault()
        if (value && value.length > 0) {
            resetPassword({ user, newPassword: value }).then((data) => {
                if (data.ok) {
                    toast('Password Successfully Changed')
                    ref?.current?.click()
                    setValue('')
                }
            })
        }
    }

    return (
        <Dialog >

            <DialogTrigger ref={ref} asChild>
                <Button variant="outline">Reset Password</Button>
            </DialogTrigger>
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogDescription>
                        {`Change User password`}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                {`Name`}
                            </Label>
                            <div className="col-span-3">
                                {user.username}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                                {`New Password`}
                            </Label>
                            <Input id="password" type="password" autoFocus onChange={(ev) => {
                                //
                                setValue(ev.target.value)
                                //
                            }} value={value} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>

                </form>
            </DialogContent>
        </Dialog>
    )
}