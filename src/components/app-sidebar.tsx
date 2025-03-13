'use client'

import * as React from 'react'
import {
    BookOpen,
    Bot,
    Command,
    Frame,
    LayoutDashboardIcon,
    LifeBuoy,
    Map,
    PieChart,
    Send,
    Settings2,
    SquareTerminal,
    Terminal,
} from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavProjects } from '@/components/nav-projects'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
import { getMySelf } from '@/actions/getMySelf'

const dataDefault = {
    user: {
        name: 'shadcn',
        email: 'm@example.com',
        role: 'admin',
        avatar: '/admin.svg',
    },
    navMain: [
        {
            title: 'Dashboard',
            url: '/admin',
            icon: LayoutDashboardIcon,
            isActive: true,
            items: [
                {
                    title: 'Users',
                    url: '/admin/users',
                },
                {
                    title: 'AI Devices',
                    url: '/admin/clients',
                },

                {
                    title: 'Telegram Bots',
                    url: '/admin/telegram-bots',
                },
            ],
        },
        {
            title: 'Models',
            url: '#',
            icon: Bot,
            items: [
                {
                    title: 'Genesis',
                    url: '#',
                },
                {
                    title: 'Explorer',
                    url: '#',
                },
                {
                    title: 'Quantum',
                    url: '#',
                },
            ],
        },
        {
            title: 'Documentation',
            url: '#',
            icon: BookOpen,
            items: [
                {
                    title: 'Introduction',
                    url: '#',
                },
                {
                    title: 'Get Started',
                    url: '#',
                },
                {
                    title: 'Tutorials',
                    url: '#',
                },
                {
                    title: 'Changelog',
                    url: '#',
                },
            ],
        },
        {
            title: 'Settings',
            url: '#',
            icon: Settings2,
            items: [
                {
                    title: 'General',
                    url: '#',
                },
                {
                    title: 'Team',
                    url: '#',
                },
                {
                    title: 'Billing',
                    url: '#',
                },
                {
                    title: 'Limits',
                    url: '#',
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: 'Support',
            url: '#',
            icon: LifeBuoy,
        },
        {
            title: 'Feedback',
            url: '#',
            icon: Send,
        },
    ],
    projects: [
        {
            name: 'Design Engineering',
            url: '#',
            icon: Frame,
        },
        {
            name: 'Sales & Marketing',
            url: '#',
            icon: PieChart,
        },
        {
            name: 'Travel',
            url: '#',
            icon: Map,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    let [data, setData] = React.useState(dataDefault)
    React.useEffect(() => {
        //

        getMySelf().then((data) => {
            console.log(data)

            setData((r) => {
                //

                //
                return {
                    ...dataDefault,
                    user: {
                        name: data.username,
                        role: data.role,
                        email: 'm@example.com',
                        avatar: '/admin.svg',
                    },
                }
            })
        })

        //
    }, [])

    //
    return (
        <Sidebar variant='inset' {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size='lg' asChild>
                            <a href='/admin'>
                                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                                    <Terminal className='size-4' />
                                </div>
                                <div className='grid flex-1 text-left text-sm leading-tight'>
                                    <span className='truncate font-semibold'>Private AI</span>
                                    <span className='truncate text-xs'>Cloud</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
                <NavSecondary items={data.navSecondary} className='mt-auto' />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}
