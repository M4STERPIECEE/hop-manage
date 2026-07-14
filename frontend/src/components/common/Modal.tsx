import { Box, Flex, Heading, Button } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <Flex
            position="fixed"
            top="0"
            left="0"
            w="100%"
            h="100%"
            bg="rgba(0, 0, 0, 0.5)"
            zIndex="2000"
            alignItems="center"
            justifyContent="center"
            p="1rem"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <Box
                bg="white"
                borderRadius="16px"
                maxW="600px"
                w="100%"
                maxH="90vh" 
                overflowY="auto"
                css={{
                    animation: 'slideUp 0.3s ease-out',
                }}
            >
                <Flex
                    p="2rem"
                    borderBottom="2px solid var(--border)"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Heading
                        as="h2"
                        fontFamily="'Crimson Pro', serif"
                        fontSize="1.8rem"
                        color="primary"
                    >
                        {title}
                    </Heading>
                    <Button
                        onClick={onClose}
                        bg="none"
                        border="none"
                        fontSize="2rem"
                        cursor="pointer"
                        color="textGray"
                        transition="color 0.3s"
                        _hover={{ color: 'danger' }}
                        p="0"
                        minW="auto"
                        h="auto"
                    >
                        ×
                    </Button>
                </Flex>
                <Box p="2rem">{children}</Box>
            </Box>
        </Flex>
    );
};
