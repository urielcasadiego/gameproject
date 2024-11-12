'use client';
import dynamic from 'next/dynamic';
import { Provider } from 'react-redux';
import { store, persistor } from 'game/app/store/store';

const PersistGate = dynamic(
    () =>
        import('redux-persist/integration/react').then(
            (mod) => mod.PersistGate,
        ),
    { ssr: false },
);

export default function StoreProvider({ children }) {
    return (
        <Provider store={store}>
            <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
}
