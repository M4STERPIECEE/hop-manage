/* eslint-disable react-refresh/only-export-components */
import { createToaster, Toaster as ChakraToaster } from '@chakra-ui/react';

export const toaster = createToaster({
    placement: 'top-end',
    pauseOnPageIdle: true,
});

export const Toaster = () => {
    return <ChakraToaster toaster={toaster} />;
};
