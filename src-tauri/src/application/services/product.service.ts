import { Product } from '@domain/entities/product.entity';
import { ProductImage } from '@domain/entities/product-image.entity';
import { MotorcycleCompatibility } from '@domain/entities/motorcycle-compatibility.entity';
import { IProductRepository } from '@domain/repositories/product.repository.interface';
import { ProductMapper } from '../mappers/product.mapper';
import {
  ProductDTO,
  ProductCreateDTO,
  ProductUpdateDTO,
  ProductImageCreateDTO,
  MotorcycleCompatibilityCreateDTO,
} from '../dtos/product.dto';
import { ValidationError, NotFoundError, ConflictError } from '@shared/errors/custom-error';
import { isRequired, isPositive, isNonNegative } from '@shared/validators/validators';

/**
 * Application service for Product operations
 */
export class ProductService {
  constructor(
    private productRepository: IProductRepository,
  ) {}

  /**
   * Get all products with optional filters
   */
  async getProducts(filters?: {
    active?: boolean;
    brandId?: string;
    categoryId?: string;
    supplierId?: string;
    lowStock?: boolean;
  }): Promise<ProductDTO[]> {
    const products = await this.productRepository.findAll(filters);
    return ProductMapper.toDTOArray(products);
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<ProductDTO> {
    const product = await this.productRepository.findById(id);
    
    if (!product) {
      throw new NotFoundError('Product', id);
    }

    return ProductMapper.toDTO(product);
  }

  /**
   * Get product by barcode
   */
  async getProductByBarcode(barcode: string): Promise<ProductDTO> {
    const product = await this.productRepository.findByBarcode(barcode);
    
    if (!product) {
      throw new NotFoundError('Product', barcode);
    }

    return ProductMapper.toDTO(product);
  }

  /**
   * Get product by internal code
   */
  async getProductByInternalCode(internalCode: string): Promise<ProductDTO> {
    const product = await this.productRepository.findByInternalCode(internalCode);
    
    if (!product) {
      throw new NotFoundError('Product', internalCode);
    }

    return ProductMapper.toDTO(product);
  }

  /**
   * Search products
   */
  async searchProducts(query: string): Promise<ProductDTO[]> {
    if (!isRequired(query)) {
      throw new ValidationError('Search query is required');
    }

    const products = await this.productRepository.search(query);
    return ProductMapper.toDTOArray(products);
  }

  /**
   * Create a new product
   */
  async createProduct(data: ProductCreateDTO): Promise<ProductDTO> {
    // Validate input
    this.validateProductCreate(data);

    // Check if internal code is available
    const internalCodeAvailable = !(await this.productRepository.existsByInternalCode(data.internalCode));
    if (!internalCodeAvailable) {
      throw new ConflictError('Internal code already exists');
    }

    // Check if barcode is available
    if (data.barcode) {
      const barcodeAvailable = !(await this.productRepository.existsByBarcode(data.barcode));
      if (!barcodeAvailable) {
        throw new ConflictError('Barcode already exists');
      }
    }

    // Create product entity
    const product = Product.create({
      internalCode: data.internalCode,
      barcode: data.barcode,
      sku: data.sku,
      name: data.name,
      description: data.description,
      brandId: data.brandId,
      categoryId: data.categoryId,
      unit: data.unit,
      stock: data.stock,
      minStock: data.minStock,
      maxStock: data.maxStock,
      location: data.location,
      purchasePrice: data.purchasePrice,
      salePrice: data.salePrice,
      supplierId: data.supplierId,
      observations: data.observations,
    });

    // Add images
    if (data.images && data.images.length > 0) {
      data.images.forEach((img, index) => {
        const image = ProductImage.create({
          productId: product.id,
          path: img.path,
          order: img.order ?? index,
        });
        product.addImage(image);
      });
    }

    // Add compatibilities
    if (data.compatibilities && data.compatibilities.length > 0) {
      data.compatibilities.forEach(c => {
        const compatibility = MotorcycleCompatibility.create({
          productId: product.id,
          brand: c.brand,
          model: c.model,
          year: c.year,
          notes: c.notes,
        });
        product.addCompatibility(compatibility);
      });
    }

    // Save product
    const createdProduct = await this.productRepository.create(product);

    return ProductMapper.toDTO(createdProduct);
  }

  /**
   * Update an existing product
   */
  async updateProduct(data: ProductUpdateDTO): Promise<ProductDTO> {
    // Get existing product
    const product = await this.productRepository.findById(data.id);
    if (!product) {
      throw new NotFoundError('Product', data.id);
    }

    // Update internal code
    if (data.internalCode !== undefined) {
      if (!isRequired(data.internalCode)) {
        throw new ValidationError('Internal code is required');
      }
      
      const internalCodeAvailable = !(await this.productRepository.existsByInternalCode(data.internalCode));
      if (!internalCodeAvailable && data.internalCode !== product.internalCode) {
        throw new ConflictError('Internal code already exists');
      }
      
      product.updateInternalCode(data.internalCode);
    }

    // Update barcode
    if (data.barcode !== undefined) {
      if (data.barcode) {
        const barcodeAvailable = !(await this.productRepository.existsByBarcode(data.barcode));
        if (!barcodeAvailable && data.barcode !== product.barcode) {
          throw new ConflictError('Barcode already exists');
        }
      }
      product.updateBarcode(data.barcode || null);
    }

    if (data.sku !== undefined) {
      product.updateSku(data.sku || null);
    }

    if (data.name !== undefined) {
      if (!isRequired(data.name)) {
        throw new ValidationError('Product name is required');
      }
      product.updateName(data.name);
    }

    if (data.description !== undefined) {
      product.updateDescription(data.description || null);
    }

    if (data.brandId !== undefined) {
      if (!isRequired(data.brandId)) {
        throw new ValidationError('Brand ID is required');
      }
      product.updateBrandId(data.brandId);
    }

    if (data.categoryId !== undefined) {
      if (!isRequired(data.categoryId)) {
        throw new ValidationError('Category ID is required');
      }
      product.updateCategoryId(data.categoryId);
    }

    if (data.unit !== undefined) {
      if (!isRequired(data.unit)) {
        throw new ValidationError('Unit is required');
      }
      product.updateUnit(data.unit);
    }

    if (data.stock !== undefined) {
      if (!isNonNegative(data.stock)) {
        throw new ValidationError('Stock cannot be negative');
      }
      product.updateStock(data.stock);
    }

    if (data.purchasePrice !== undefined && data.salePrice !== undefined) {
      product.updatePrices(data.purchasePrice, data.salePrice);
    } else if (data.purchasePrice !== undefined) {
      product.updatePrices(data.purchasePrice, product.salePrice);
    } else if (data.salePrice !== undefined) {
      product.updatePrices(product.purchasePrice, data.salePrice);
    }

    if (data.minStock !== undefined || data.maxStock !== undefined) {
      const minStock = data.minStock !== undefined ? data.minStock : product.minStock;
      const maxStock = data.maxStock !== undefined ? data.maxStock : product.maxStock;
      product.updateStockLimits(minStock, maxStock);
    }

    if (data.location !== undefined) {
      product.updateLocation(data.location || null);
    }

    if (data.supplierId !== undefined) {
      product.updateSupplierId(data.supplierId || null);
    }

    if (data.observations !== undefined) {
      product.updateObservations(data.observations || null);
    }

    if (data.active !== undefined) {
      if (data.active) {
        product.activate();
      } else {
        product.deactivate();
      }
    }

    // Update images (replace all)
    if (data.images !== undefined) {
      product.clearImages();
      data.images.forEach((img, index) => {
        const image = ProductImage.create({
          productId: product.id,
          path: img.path,
          order: img.order ?? index,
        });
        product.addImage(image);
      });
    }

    // Update compatibilities (replace all)
    if (data.compatibilities !== undefined) {
      product.clearCompatibilities();
      data.compatibilities.forEach(c => {
        const compatibility = MotorcycleCompatibility.create({
          productId: product.id,
          brand: c.brand,
          model: c.model,
          year: c.year,
          notes: c.notes,
        });
        product.addCompatibility(compatibility);
      });
    }

    // Save product
    const updatedProduct = await this.productRepository.update(product);

    return ProductMapper.toDTO(updatedProduct);
  }

  /**
   * Delete a product
   */
  async deleteProduct(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('Product', id);
    }

    await this.productRepository.delete(id);
  }

  // ============================================
  // PRIVATE METHODS
  // ============================================

  private validateProductCreate(data: ProductCreateDTO): void {
    if (!isRequired(data.internalCode)) {
      throw new ValidationError('Internal code is required');
    }
    if (!isRequired(data.name)) {
      throw new ValidationError('Product name is required');
    }
    if (data.name.length < 2) {
      throw new ValidationError('Product name must be at least 2 characters');
    }
    if (!isRequired(data.brandId)) {
      throw new ValidationError('Brand ID is required');
    }
    if (!isRequired(data.categoryId)) {
      throw new ValidationError('Category ID is required');
    }
    if (!isRequired(data.unit)) {
      throw new ValidationError('Unit is required');
    }
    if (data.stock !== undefined && !isNonNegative(data.stock)) {
      throw new ValidationError('Stock cannot be negative');
    }
    if (data.minStock !== undefined && !isNonNegative(data.minStock)) {
      throw new ValidationError('Minimum stock cannot be negative');
    }
    if (data.purchasePrice !== undefined && !isNonNegative(data.purchasePrice)) {
      throw new ValidationError('Purchase price cannot be negative');
    }
    if (data.salePrice !== undefined && !isNonNegative(data.salePrice)) {
      throw new ValidationError('Sale price cannot be negative');
    }
  }
}
