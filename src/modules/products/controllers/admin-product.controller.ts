import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { ProductsService } from '../services';
import {
  CreateProductDto,
  CreateProductValidator,
  UpdateProductDto,
  UpdateProductValidator,
} from '../dto';
import { ProductQueryParams } from 'src/shared/types';
import { ZodValidationPipe } from 'src/common/pipes';
import { UserRole } from 'src/common/enums';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
@Controller('admin/products')
export class AdminProductController {
  constructor(private productsService: ProductsService) {}

  @Post()
  async createProduct(
    @Body(new ZodValidationPipe(CreateProductValidator)) data: CreateProductDto,
  ) {
    return this.productsService.createProduct(data);
  }

  @Get()
  async getProducts(@Query() query: ProductQueryParams) {
    return this.productsService.getProducts(query);
  }

  @Get(':productId')
  async getProduct(@Param('productId') productId: string) {
    return this.productsService.getProduct(productId);
  }

  @Put(':productId')
  async updateProduct(
    @Param('productId') productId: string,
    @Body(new ZodValidationPipe(UpdateProductValidator)) data: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(productId, data);
  }

  @Delete(':productId')
  async deleteProduct(@Param('productId') productId: string) {
    return this.productsService.deleteProduct(productId);
  }
}
