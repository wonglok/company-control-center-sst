'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { jwt2data } from "@/sst/ws/util/auth"
import { Resource } from "sst"
import { AppPage } from "./AppPage"

export default async function Page(ctx) {
    //
    let cookieStore = await cookies()
    //
    let session = cookieStore.get('session')?.value

    let query = await ctx.params
    //
    let botID = query.botID

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
                }} user={userInfo} botID={botID} jwt={jwt}></AppPage>
            </>
        } catch (e) {
            console.log(e)
        }
    }
}