import { Box, Flex, Heading, Button, Text } from '@chakra-ui/react';

interface ConfirmModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmButtonColor?: string;
}

export const ConfirmModal = ({
    isOpen,
    onConfirm,
    onCancel,
    title,
    message,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    confirmButtonColor = 'danger',
}: ConfirmModalProps) => {
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
            align="center"
            justify="center"
            p="1rem"
        >
            <Box
                bg="white"
                borderRadius="16px"
                maxW="500px"
                w="100%"
                css={{
                    animation: 'slideUp 0.3s ease-out',
                }}
            >
                <Flex
                    p="2rem"
                    borderBottom="2px solid var(--border)"
                    justify="space-between"
                    align="center"
                >
                    <Heading
                        as="h2"
                        fontFamily="'Crimson Pro', serif"
                        fontSize="1.8rem"
                        color="primary"
                    >
                        {title}
                    </Heading>
                </Flex>
                
                <Box p="2rem">
                    <Text
                        fontSize="1.1rem"
                        color="textGray"
                        mb="2rem"
                        lineHeight="1.6"
                    >
                        {message}
                    </Text>

                    <Flex gap="1rem" justify="flex-end">
                        <Button
                            onClick={onCancel}
                            bg="white"
                            color="primary"
                            border="2px solid var(--primary)"
                            px="1.5rem"
                            py="0.8rem"
                            borderRadius="8px"
                            cursor="pointer"
                            fontWeight="500"
                            transition="all 0.3s"
                            _hover={{
                                bg: 'primary',
                                color: 'white',
                            }}
                        >
                            {cancelText}
                        </Button>
                        <Button
                            onClick={onConfirm}
                            bg={confirmButtonColor}
                            color="white"
                            px="1.5rem"
                            py="0.8rem"
                            border="none"
                            borderRadius="8px"
                            cursor="pointer"
                            fontWeight="500"
                            transition="all 0.3s"
                            _hover={{
                                bg: confirmButtonColor === 'danger' ? '#dc2626' : confirmButtonColor,
                                transform: 'translateY(-2px)',
                            }}
                        >
                            {confirmText}
                        </Button>
                    </Flex>
                </Box>
            </Box>
        </Flex>
    );
};
