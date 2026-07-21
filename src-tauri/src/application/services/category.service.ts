import { Category } from '@domain/entities/category.entity';
import { Brand } from '@domain/entities/brand.entity';
import { ICategoryRepository } from '@domain/repositories/category.repository.interface';
import { IBrandRepository } from '@domain/repositories/brand.repository.interface';
import { CategoryMapper, BrandMapper } from '../mappers/category.mapper';
import {
  CategoryDTO,
  CategoryCreateDTO,
  CategoryUpdateDTO,
  BrandDTO,
  BrandCreateDTO,
  BrandUpdateDTO,
} from '../dtos/category.dto';
import { ValidationError, NotFoundError, ConflictError, BusinessError } from '@shared/errors/custom-error';
import { isRequired } from '@shared/validators/validators';

/**
 * Application service for Category and Brand operations
 */
export class CategoryService {
  constructor(
    private categoryRepository: ICategoryRepository,
    private brandRepository: IBrandRepository
  ) {}

  // ============================================
  // CATEGORY OPERATIONS
  // ============================================

  /**
   * Get all categories with optional filters
   */
  async getCategories(filters?: {
    active?: boolean;
  }): Promise<CategoryDTO[]> {
    const categories = await this.categoryRepository.findAll(filters);
    return CategoryMapper.toDTOArray(categories);
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: string): Promise<CategoryDTO> {
    const category = await this.categoryRepository.findById(id);
    
    if (!category) {
      throw new NotFoundError('Category', id);
    }

    return CategoryMapper.toDTO(category);
  }

  /**
   * Create a new category
   */
  async createCategory(data: CategoryCreateDTO): Promise<CategoryDTO> {
    // Validate input
    this.validateCategoryCreate(data);

    // Check if name is available
    const nameAvailable = !(await this.categoryRepository.existsByName(data.name));
    if (!nameAvailable) {
      throw new ConflictError('Category name already exists');
    }

    // Create category entity
    const category = Category.create({
      name: data.name,
      description: data.description,
    });

    // Save category
    const createdCategory = await this.categoryRepository.create(category);

    return CategoryMapper.toDTO(createdCategory);
  }

  /**
   * Update an existing category
   */
  async updateCategory(data: CategoryUpdateDTO): Promise<CategoryDTO> {
    // Get existing category
    const category = await this.categoryRepository.findById(data.id);
    if (!category) {
      throw new NotFoundError('Category', data.id);
    }

    // Validate input
    if (data.name !== undefined) {
      if (!isRequired(data.name)) {
        throw new ValidationError('Category name is required');
      }
      if (data.name.length < 2) {
        throw new ValidationError('Category name must be at least 2 characters');
      }
      
      // Check if name is available
      const nameAvailable = !(await this.categoryRepository.existsByName(data.name));
      if (!nameAvailable && data.name !== category.name) {
        throw new ConflictError('Category name already exists');
      }
      
      category.updateName(data.name);
    }

    if (data.description !== undefined) {
      category.updateDescription(data.description);
    }

    if (data.active !== undefined) {
      if (data.active) {
        category.activate();
      } else {
        category.deactivate();
      }
    }

    // Save category
    const updatedCategory = await this.categoryRepository.update(category);

    return CategoryMapper.toDTO(updatedCategory);
  }

  /**
   * Delete a category
   */
  async deleteCategory(id: string): Promise<void> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundError('Category', id);
    }

    // Check if category is being used by products
    // This check would be done in the repository or with a product count
    // For now, we'll allow deletion but could add this check later

    await this.categoryRepository.delete(id);
  }

  // ============================================
  // BRAND OPERATIONS
  // ============================================

  /**
   * Get all brands with optional filters
   */
  async getBrands(filters?: {
    active?: boolean;
  }): Promise<BrandDTO[]> {
    const brands = await this.brandRepository.findAll(filters);
    return BrandMapper.toDTOArray(brands);
  }

  /**
   * Get brand by ID
   */
  async getBrandById(id: string): Promise<BrandDTO> {
    const brand = await this.brandRepository.findById(id);
    
    if (!brand) {
      throw new NotFoundError('Brand', id);
    }

    return BrandMapper.toDTO(brand);
  }

  /**
   * Create a new brand
   */
  async createBrand(data: BrandCreateDTO): Promise<BrandDTO> {
    // Validate input
    this.validateBrandCreate(data);

    // Check if name is available
    const nameAvailable = !(await this.brandRepository.existsByName(data.name));
    if (!nameAvailable) {
      throw new ConflictError('Brand name already exists');
    }

    // Create brand entity
    const brand = Brand.create({
      name: data.name,
      description: data.description,
      website: data.website,
    });

    // Save brand
    const createdBrand = await this.brandRepository.create(brand);

    return BrandMapper.toDTO(createdBrand);
  }

  /**
   * Update an existing brand
   */
  async updateBrand(data: BrandUpdateDTO): Promise<BrandDTO> {
    // Get existing brand
    const brand = await this.brandRepository.findById(data.id);
    if (!brand) {
      throw new NotFoundError('Brand', data.id);
    }

    // Validate input
    if (data.name !== undefined) {
      if (!isRequired(data.name)) {
        throw new ValidationError('Brand name is required');
      }
      if (data.name.length < 2) {
        throw new ValidationError('Brand name must be at least 2 characters');
      }
      
      // Check if name is available
      const nameAvailable = !(await this.brandRepository.existsByName(data.name));
      if (!nameAvailable && data.name !== brand.name) {
        throw new ConflictError('Brand name already exists');
      }
      
      brand.updateName(data.name);
    }

    if (data.description !== undefined) {
      brand.updateDescription(data.description);
    }

    if (data.website !== undefined) {
      brand.updateWebsite(data.website);
    }

    if (data.active !== undefined) {
      if (data.active) {
        brand.activate();
      } else {
        brand.deactivate();
      }
    }

    // Save brand
    const updatedBrand = await this.brandRepository.update(brand);

    return BrandMapper.toDTO(updatedBrand);
  }

  /**
   * Delete a brand
   */
  async deleteBrand(id: string): Promise<void> {
    const brand = await this.brandRepository.findById(id);
    if (!brand) {
      throw new NotFoundError('Brand', id);
    }

    // Check if brand is being used by products
    // This check would be done in the repository or with a product count
    // For now, we'll allow deletion but could add this check later

    await this.brandRepository.delete(id);
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private validateCategoryCreate(data: CategoryCreateDTO): void {
    if (!isRequired(data.name)) {
      throw new ValidationError('Category name is required');
    }
    if (data.name.length < 2) {
      throw new ValidationError('Category name must be at least 2 characters');
    }
  }

  private validateBrandCreate(data: BrandCreateDTO): void {
    if (!isRequired(data.name)) {
      throw new ValidationError('Brand name is required');
    }
    if (data.name.length < 2) {
      throw new ValidationError('Brand name must be at least 2 characters');
    }
  }
}
