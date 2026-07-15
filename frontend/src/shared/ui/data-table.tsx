import { Box, Button, Flex, Heading, Input, Text, Spinner, Icon } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { Search, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface DataTableProps {
    title: string;
    subtitle?: string;
    onAdd?: () => void;
    addButtonText?: string;
    searchPlaceholder?: string;
    searchValue?: string;
    onSearch?: (value: string) => void;
    filters?: ReactNode;
    isLoading?: boolean;
    isEmpty?: boolean;
    emptyMessage?: string;
    emptySubMessage?: string;
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    children: ReactNode;
}

export const DataTable = ({
    title,
    subtitle,
    onAdd,
    addButtonText = 'Nouveau',
    searchPlaceholder = 'Rechercher...',
    searchValue,
    onSearch,
    filters,
    isLoading = false,
    isEmpty = false,
    emptyMessage = 'Aucune donnée trouvée',
    emptySubMessage = 'Essayez de modifier vos critères de recherche',
    currentPage,
    totalPages,
    onPageChange,
    children,
}: DataTableProps) => {
    return (
        <Box bg="white" borderRadius="12px" p="1.5rem" boxShadow="0 2px 12px rgba(10, 77, 104, 0.08)" border="1px solid rgba(10, 77, 104, 0.08)">
            <Flex justify="space-between" align="center" mb="1.5rem" gap="1rem" flexWrap="wrap">
                <Box>
                    <Heading as="h2" fontFamily="'Poppins', sans-serif" fontSize="1.5rem" color="primary" mb="0.25rem" fontWeight="700">
                        {title}
                    </Heading>
                    {subtitle && (
                        <Text fontSize="0.85rem" color="rgba(10, 77, 104, 0.6)" fontWeight="500">
                            {subtitle}
                        </Text>
                    )}
                </Box>

                <Flex gap="1rem" align="center" flexWrap="nowrap" maxW="100%">
                    {onSearch && (
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(e) => onSearch(e.target.value)}
                            border="2px solid rgba(10, 77, 104, 0.15)"
                            borderRadius="8px"
                            px="1rem"
                            py="0.6rem"
                            fontSize="0.9rem"
                            w={{ base: "100%", md: "300px" }}
                            transition="all 0.3s ease"
                            _focus={{ borderColor: 'accent', boxShadow: '0 0 0 3px rgba(5, 199, 226, 0.1)', outline: 'none' }}
                            _hover={{ borderColor: 'rgba(10, 77, 104, 0.25)' }}
                        />
                    )}
                    
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
                            _hover={{ bg: '#04b3cf', transform: 'translateY(-2px)' }}
                        >
                            <Icon as={Plus} boxSize="1.1rem" />
                            {addButtonText}
                        </Button>
                    )}
                </Flex>
            </Flex>

            {filters && (
                <Box mb="1.5rem">
                    {filters}
                </Box>
            )}

            <Box overflowX="auto" borderRadius="8px" border="1px solid rgba(10, 77, 104, 0.1)" minH="200px" position="relative">
                {isLoading ? (
                    <Flex justify="center" align="center" py="5rem">
                        <Spinner size="xl" color="primary" />
                    </Flex>
                ) : isEmpty ? (
                    <Box textAlign="center" py="4rem">
                        <Icon as={Search} boxSize="3rem" color="rgba(10, 77, 104, 0.2)" mb="1rem" />
                        <Text fontSize="1.1rem" fontWeight="600" color="primary" mb="0.5rem">{emptyMessage}</Text>
                        <Text fontSize="0.9rem" color="rgba(10, 77, 104, 0.6)">{emptySubMessage}</Text>
                    </Box>
                ) : (
                    children
                )}
            </Box>

            {totalPages !== undefined && currentPage !== undefined && onPageChange && totalPages > 0 && !isLoading && !isEmpty && (
                <Flex justify="center" align="center" gap="1rem" mt="1.5rem">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
                        disabled={currentPage === 0}
                        _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
                        border="1px solid rgba(10, 77, 104, 0.2)"
                        borderRadius="8px"
                        _hover={currentPage > 0 ? { bg: 'rgba(5, 199, 226, 0.1)', color: 'accent', borderColor: 'accent' } : {}}
                    >
                        <Icon as={ChevronLeft} />
                    </Button>
                    <Text fontWeight="600" fontSize="0.9rem" color="primary">
                        Page {currentPage + 1} sur {totalPages}
                    </Text>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
                        disabled={currentPage >= totalPages - 1}
                        _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
                        border="1px solid rgba(10, 77, 104, 0.2)"
                        borderRadius="8px"
                        _hover={currentPage < totalPages - 1 ? { bg: 'rgba(5, 199, 226, 0.1)', color: 'accent', borderColor: 'accent' } : {}}
                    >
                        <Icon as={ChevronRight} />
                    </Button>
                </Flex>
            )}
        </Box>
    );
};