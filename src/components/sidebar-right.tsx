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

// This is sample data.
const data = {
    navMain: [
        {
            title: 'Getting Started',
            nodeName: '#',
            items: [
                {
                    title: 'Installation',
                    nodeName: '#',
                },
                {
                    title: 'Project Structure',
                    nodeName: '#',
                },
            ],
        },
        {
            title: 'Building Your Application',
            nodeName: '#',
            items: [
                {
                    title: 'Routing',
                    nodeName: '#',
                },
                {
                    title: 'Data Fetching',
                    nodeName: '#',
                    isActive: true,
                },
                {
                    title: 'Rendering',
                    nodeName: '#',
                },
                {
                    title: 'Caching',
                    nodeName: '#',
                },
                {
                    title: 'Styling',
                    nodeName: '#',
                },
                {
                    title: 'Optimizing',
                    nodeName: '#',
                },
                {
                    title: 'Configuring',
                    nodeName: '#',
                },
                {
                    title: 'Testing',
                    nodeName: '#',
                },
                {
                    title: 'Authentication',
                    nodeName: '#',
                },
                {
                    title: 'Deploying',
                    nodeName: '#',
                },
                {
                    title: 'Upgrading',
                    nodeName: '#',
                },
                {
                    title: 'Examples',
                    nodeName: '#',
                },
            ],
        },
        {
            title: 'API Reference',
            nodeName: '#',
            items: [
                {
                    title: 'Components',
                    nodeName: '#',
                },
                {
                    title: 'File Conventions',
                    nodeName: '#',
                },
                {
                    title: 'Functions',
                    nodeName: '#',
                },
                {
                    title: 'next.config.js Options',
                    nodeName: '#',
                },
                {
                    title: 'CLI',
                    nodeName: '#',
                },
                {
                    title: 'Edge Runtime',
                    nodeName: '#',
                },
            ],
        },
        {
            title: 'Architecture',
            nodeName: '#',
            items: [
                {
                    title: 'Accessibility',
                    nodeName: '#',
                },
                {
                    title: 'Fast Refresh',
                    nodeName: '#',
                },
                {
                    title: 'Next.js Compiler',
                    nodeName: '#',
                },
                {
                    title: 'Supported Browsers',
                    nodeName: '#',
                },
                {
                    title: 'Turbopack',
                    nodeName: '#',
                },
            ],
        },
        {
            title: 'Community',
            nodeName: '#',
            items: [
                {
                    title: 'Contribution Guide',
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
                    <SidebarGroupLabel>Table of Contents</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {data.navMain.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <span onClick={() => createNode(`${item.nodeName}`)} className='font-medium'>
                                            {item.title}
                                        </span>
                                    </SidebarMenuButton>
                                    {item.items?.length ? (
                                        <SidebarMenuSub>
                                            {item.items.map((item) => (
                                                <SidebarMenuSubItem key={item.title}>
                                                    <SidebarMenuSubButton asChild isActive={item.isActive}>
                                                        <span onClick={() => createNode(`${item.nodeName}`)}>
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
