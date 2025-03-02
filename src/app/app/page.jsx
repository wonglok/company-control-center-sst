'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AppPage } from "./_ui/AppPage"
import { jwt2data } from "@/sst/ws/util/auth"
import { Resource } from "sst"

export default async function Page() {
    //
    let cookieStore = await cookies()
    //
    let session = cookieStore.get('session')?.value

    //
    if (!session) {
        redirect('/admin-login')
    } else {
        try {
            let userInfo = await jwt2data({ payload: session, secretKey: Resource.SESSION_SECRET.value })
            let jwt = session

            return <>
                <AppPage user={userInfo} jwt={jwt}></AppPage>
            </>
        } catch (e) {
            console.log(e)
        }
    }
}