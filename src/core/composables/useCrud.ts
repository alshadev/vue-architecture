import { ref, reactive } from 'vue'
import type { Pagination } from '@/core/components/base/BaseDataTable.vue'

export interface ICrudService<T, CreateDto, UpdateDto, FilterDto> {
    getAll(params?: FilterDto & { page: number; limit: number }): Promise<{ data: T[]; total: number }>
    getById(id: string): Promise<T>
    create(data: CreateDto): Promise<T>
    update(id: string, data: UpdateDto): Promise<T>
    delete(id: string): Promise<void>
}

export function useCrud<T, CreateDto, UpdateDto, FilterDto extends object>(
    service: ICrudService<T, CreateDto, UpdateDto, FilterDto>,
    defaultFilters: FilterDto
) {
    const items = ref<T[]>([]) as any
    const loading = ref(false)
    const selectedItem = ref<T | null>(null)

    const pagination = reactive<Pagination>({
        page: 1,
        limit: 10,
        total: 0
    })

    // Deep clone default filters to allow reset
    const filters = reactive({ ...defaultFilters }) as FilterDto

    const fetchItems = async () => {
        loading.value = true
        try {
            const params = {
                ...filters,
                page: pagination.page,
                limit: pagination.limit
            }
            const { data, total } = await service.getAll(params)
            items.value = data
            pagination.total = total
        } catch (error) {
            console.error('Failed to fetch items:', error)
            // TODO: Add global notification/toast here
        } finally {
            loading.value = false
        }
    }

    const handlePageChange = (p: Pagination) => {
        pagination.page = p.page
        pagination.limit = p.limit
        fetchItems()
    }

    const handleSearch = (query: string) => {
        // Assuming 'search' is a key in FilterDto, or we handle it specifically
        // casting to any to simplify for this generic
        (filters as any).search = query
        pagination.page = 1 // Reset to first page
        fetchItems()
    }

    const handleFilterChange = (newFilters: Partial<FilterDto>) => {
        Object.assign(filters, newFilters)
        pagination.page = 1
        fetchItems()
    }

    const createItem = async (data: CreateDto) => {
        loading.value = true
        try {
            await service.create(data)
            await fetchItems()
            return true
        } catch (error) {
            console.error('Failed to create item:', error)
            return false
        } finally {
            loading.value = false
        }
    }

    const updateItem = async (id: string, data: UpdateDto) => {
        loading.value = true
        try {
            await service.update(id, data)
            await fetchItems()
            return true
        } catch (error) {
            console.error('Failed to update item:', error)
            return false
        } finally {
            loading.value = false
        }
    }

    const deleteItem = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return // Simple confirm for now

        loading.value = true
        try {
            await service.delete(id)

            // If deleting the last item on the page, go back one page
            if (items.value.length === 1 && pagination.page > 1) {
                pagination.page--
            }

            await fetchItems()
            return true
        } catch (error) {
            console.error('Failed to delete item:', error)
            return false
        } finally {
            loading.value = false
        }
    }

    return {
        items,
        loading,
        pagination,
        filters,
        selectedItem,
        fetchItems,
        handlePageChange,
        handleSearch,
        handleFilterChange,
        createItem,
        updateItem,
        deleteItem
    }
}
