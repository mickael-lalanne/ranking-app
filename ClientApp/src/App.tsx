import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import Layout from './components/Layout';
import './custom.css';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key');
}
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <ClerkProvider publishableKey={clerkPubKey}>
                <Layout>
                    <SignedIn>
                        <Routes>
                            {AppRoutes.map((route, index) => {
                                const { element, ...rest } = route;
                                return (
                                    <Route key={index} {...rest} element={element} />
                                );
                            })}
                        </Routes>
                    </SignedIn>

                    <SignedOut>
                        <RedirectToSignIn />
                    </SignedOut>
                </Layout>
            </ClerkProvider>
        );
    }
}
