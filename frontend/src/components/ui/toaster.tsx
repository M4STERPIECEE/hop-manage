/* eslint-disable react-refresh/only-export-components */
import { 
    createToaster, 
    Toaster as ChakraToaster, 
    Toast, 
    Stack,
    Portal
} from '@chakra-ui/react';

export const toaster = createToaster({
    placement: 'top-end',
    pauseOnPageIdle: true,
});

export const Toaster = () => {
    return (
        <Portal>
            <ChakraToaster toaster={toaster}>
                {(toast) => (
                    <Toast.Root key={toast.id}>
                        <Toast.Indicator />
                        <Stack gap="1" flex="1">
                            {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
                            {toast.description && (
                                <Toast.Description>{toast.description}</Toast.Description>
                            )}
                        </Stack>
                        <Toast.CloseTrigger />
                    </Toast.Root>
                )}
            </ChakraToaster>
        </Portal>
    );
};
