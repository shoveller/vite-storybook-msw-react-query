import type {Meta, StoryObj} from '@storybook/react';
import { rest } from 'msw'

import App from './App.tsx';
import {MemoryRouter, Route, Routes} from "react-router-dom";
import {QueryClient, QueryClientProvider, useQueryClient} from "@tanstack/react-query";
import {getWorker} from "msw-storybook-addon";
import {ComponentProps} from "react";

const meta: Meta<typeof App> = {
    title: 'App',
    component: App,
    argTypes: {},
};

export default meta;

type Story = StoryObj<typeof meta>;

const getApi = (props: ComponentProps<typeof App>) => {
    const worker = getWorker();
    worker.resetHandlers(
        rest.get(`https://pokeapi.co/api/v2/pokemon?limit=5&offset=${props.page}`, (_, res, ctx) => {
            return res(
                ctx.json({
                    results: Array.from({ length: 5 }).map(() => {
                        return {
                            name: Math.floor(Math.random() * 1000000)
                        }
                    })
                })
            )
        })
    )
}

export const 국문표시: Story = {
    parameters: {
        controls: {expanded: true},
    },
    args: {},
    decorators: [(Story,ctx) => {
        getApi(ctx.args)
        const client = useQueryClient();
        client.invalidateQueries();

        return (
            <QueryClientProvider client={new QueryClient()}>
                <MemoryRouter initialEntries={['/en?page=5']}>
                    <Routes>
                        <Route path="/en" element={<Story />}/>
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        )
    }]
};

export const 영문표시: Story = {
    parameters: {
        controls: {expanded: true},
    },
    args: {},
    decorators: [(Story,ctx) => {
        getApi(ctx.args)

        return (
            <QueryClientProvider client={new QueryClient()}>
                <MemoryRouter initialEntries={['/ko?page=5']}>
                    <Routes>
                        <Route path="/:lang" element={<Story key={JSON.stringify(ctx.args)} />}/>
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        )
    }]
};
