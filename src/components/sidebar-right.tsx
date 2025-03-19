import * as React from 'react'

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from '@/components/ui/sidebar'
import { ArrowRight, Slash, SlashSquare, Terminal } from 'lucide-react'

// This is sample data.
const data = {
    navMain: [
        {
            title: 'Telegram',
            items: [
                {
                    title: 'When Receive Message',
                    nodeName: 'WhenReceiveTelegramMessageNode',
                },
                {
                    title: 'Send Message',
                    nodeName: 'SendTelegramMessageNode',
                },
            ],
        },
        {
            title: 'Step',
            items: [
                {
                    title: 'Router',
                    nodeName: '#',
                },
                {
                    title: 'Activate Route',
                    nodeName: '#',
                },
            ],
        },
    ],
}

export function SidebarRight({ ...props }: React.ComponentProps<typeof Sidebar>) {
    let createNode = (nodeName: string) => {
        //
        //
        console.log(nodeName)
        //
        //
    }
    return (
        <Sidebar {...props}>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Differnet Kinds of Node</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {data.navMain.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <div className='my-2 ml-1 flex items-center'>
                                        <SlashSquare className='mr-2'></SlashSquare>
                                        <span className='font-medium'>{item.title}</span>
                                    </div>
                                    {item.items?.length ? (
                                        <SidebarMenuSub>
                                            {item.items.map((item) => (
                                                <SidebarMenuSubItem key={item.title}>
                                                    <SidebarMenuSubButton asChild isActive={false}>
                                                        <span
                                                            className='cursor-pointer'
                                                            onClick={() => createNode(`${item.nodeName}`)}
                                                        >
                                                            {item.title}
                                                        </span>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    ) : null}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
