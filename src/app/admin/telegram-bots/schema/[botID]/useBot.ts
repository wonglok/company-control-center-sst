import { create } from 'zustand'
import { BotType } from '../../_ui/ManageBots/ManageBots'

export const useBot = create<{
    bot: BotType
}>(() => {
    return {
        //
        bot: false,
        //
        //
        //
    }
})
