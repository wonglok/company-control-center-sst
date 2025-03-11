import { SocketTest } from "@/app/_ui/SocketTest/SocketTest"
import { Resource } from "sst";

let socketURL = Resource.SocketAPI.url

export default async function Page(ctx) {
    let params = await ctx.params

    return <>
        {/* this page should be logged in */}

        {/* developer should save this clientID for future usage. */}

        <SocketTest socketURL={socketURL} clientID={params.clientID}></SocketTest>
    </>
}