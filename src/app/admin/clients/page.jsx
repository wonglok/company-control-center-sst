'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AppPage } from "./AppPage"
import { jwt2data } from "@/sst/ws/util/auth"
import { Resource } from "sst"

export default async function Page() {
    //
    let cookieStore = await cookies()
    //
    let session = cookieStore.get('session')?.value

    //
    if (!session) {
        redirect('/login')
    } else {
        try {
            let userInfo = await jwt2data({ payload: session, secretKey: Resource.SESSION_SECRET.value })
            let jwt = session

            return <>
                <AppPage config={{
                    restURL: Resource.RestAPI.url,
                    socketURL: Resource.SocketAPI.url
                }} user={userInfo} jwt={jwt}></AppPage >
            </>
        } catch (e) {
            console.log(e)
        }
    }
}