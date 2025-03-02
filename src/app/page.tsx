import { getAppMode } from '@/actions/getAppMode'
import { redirect } from 'next/navigation'

export default async function Page() {
    let appMode = await getAppMode()

    if (appMode === 'oobe') {
        return redirect('/oobe')
    }

    if (appMode === 'app') {
        return redirect('/app')
    }
}

//
