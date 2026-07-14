import { Box, Button, Flex, Heading, Input, Table } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface DataTableProps {
    title: string;
    onAdd?: () => void;
    addButtonText?: string;
    searchPlaceholder?: string;
    onSearch?: (value: string) => void;
    children: ReactNode;
}

export const DataTable = ({
    title,
    onAdd,
    addButtonText = 'Nouveau',
    searchPlaceholder = 'Rechercher...',
    onSearch,
    children,
}: DataTableProps) => {
    return (
        <Box
            bg="white"
            borderRadius="12px"
            boxShadow="0 1px 3px rgba(10, 77, 104, 0.08)"
            overflow="hidden"
        >
            <Flex
                px="2rem"
                py="1.5rem"
                borderBottom="2px solid var(--border)"
                justify="space-between"
                align="center"
            >
                <Heading
                    as="h2"
                    fontFamily="'Crimson Pro', serif"
                    fontSize="1.5rem"
                    color="primary"
                >
                    {title}
                </Heading>
                {onAdd && (
                    <Button
                        onClick={onAdd}
                        bg="accent"
                        color="white"
                        px="1.5rem"
                        py="0.7rem"
                        border="none"
                        borderRadius="8px"
                        cursor="pointer"
                        fontWeight="600"
                        transition="all 0.3s"
                        display="flex"
                        alignItems="center"
                        gap="0.5rem"
                        _hover={{
                            bg: '#04b3cf',
                            transform: 'translateY(-2px)',
                        }}
                    >
                        <span>+</span>
                        {addButtonText}
                    </Button>
                )}
            </Flex>

            {onSearch && (
                <Box px="2rem" py="1.5rem" borderBottom="1px solid var(--border)">
                    <Input
                        type="text"
                        placeholder={searchPlaceholder}
                        onChange={(e) => onSearch(e.target.value)}
                        w="100%"
                        p="0.8rem 1rem"
                        border="2px solid var(--border)"
                        borderRadius="8px"
                        fontSize="1rem"
                    />
                </Box>
            )}

            <Box overflowX="auto">
                <Table.Root variant="outline" size="md">
                    {children}
                </Table.Root>
            </Box>
        </Box>
    );
};
