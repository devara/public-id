import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  NotEquals,
  ValidateIf,
  ValidateNested,
  ValidationOptions,
} from 'class-validator';
import {
  ToBoolean,
  ToLowerCase,
  ToSplit,
  ToUpperCase,
} from './transform.decorator';
import { Constructor } from 'src/core/types/types';
import { IsPassword } from './validators/is-password.decorator';

interface IFieldOptions {
  each?: boolean;
  swagger?: boolean;
  nullable?: boolean;
  groups?: string[];
}

interface INumberFieldOptions extends IFieldOptions {
  min?: number;
  max?: number;
  int?: boolean;
  isPositive?: boolean;
}

interface IStringFieldOptions extends IFieldOptions {
  minLength?: number;
  maxLength?: number;
  toLowerCase?: boolean;
  toUpperCase?: boolean;
}

interface IEnumFieldOptions extends IFieldOptions {
  enumName?: string;
}

type IBooleanFieldOptions = IFieldOptions;
// type ITokenFieldOptions = IFieldOptions;
type IClassFieldOptions = IFieldOptions;

export function IsNullable(options?: ValidationOptions): PropertyDecorator {
  return ValidateIf((_obj, value) => value !== null, options);
}

export function NumberField(
  options: Omit<ApiPropertyOptions, 'type'> & INumberFieldOptions = {},
): PropertyDecorator {
  const decorators = [Type(() => Number)];

  if (options?.required === false)
    decorators.push(IsOptional({ each: options.each }));

  if (options.int) decorators.push(IsInt({ each: options.each }));
  else decorators.push(IsNumber({}, { each: options.each }));

  if (options.minimum)
    decorators.push(Min(options.minimum, { each: options.each }));

  if (options.maximum)
    decorators.push(Max(options.maximum, { each: options.each }));

  if (options.swagger !== false) {
    const { required = true, ...apiOptions } = options;
    decorators.push(
      ApiProperty({
        type: Number,
        required: !!required,
        ...apiOptions,
      }),
    );
  }

  return applyDecorators(...decorators);
}

export function StringField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  const decorators = [Type(() => String), IsString({ each: options.each })];

  if (options?.required === false)
    decorators.push(IsOptional({ each: options.each }));

  decorators.push(MinLength(options?.minLength ?? 1, { each: options.each }));

  if (options.maxLength)
    decorators.push(MaxLength(options.maxLength, { each: options.each }));

  if (options.toLowerCase) decorators.push(ToLowerCase());

  if (options.toUpperCase) decorators.push(ToUpperCase());

  if (options.swagger !== false) {
    const { required = true, ...apiOptions } = options;
    decorators.push(
      ApiProperty({
        type: String,
        required: !!required,
        ...apiOptions,
        isArray: options.each,
      }),
    );
  }

  return applyDecorators(...decorators);
}

export function BooleanField(
  options: Omit<ApiPropertyOptions, 'type'> & IBooleanFieldOptions = {},
): PropertyDecorator {
  const decorators = [ToBoolean(), IsBoolean()];

  if (options?.required === false)
    decorators.push(IsOptional({ each: options.each }));

  if (options.swagger !== false) {
    const { required = true, ...apiOptions } = options;
    decorators.push(
      ApiProperty({ type: Boolean, required: !!required, ...apiOptions }),
    );
  }

  return applyDecorators(...decorators);
}

export function URLField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  const decorators = [StringField(options), IsUrl({}, { each: true })];

  if (options?.required === false)
    decorators.push(IsOptional({ each: options.each }));

  if (options.nullable) decorators.push(IsNullable({ each: options.each }));
  else decorators.push(NotEquals(null, { each: options.each }));

  return applyDecorators(...decorators);
}

export function ClassField<TClass extends Constructor>(
  getClass: () => TClass,
  options: Omit<ApiPropertyOptions, 'type'> & IClassFieldOptions = {},
): PropertyDecorator {
  const decorators = [
    Type(() => getClass()),
    ValidateNested({ each: options.each }),
  ];

  if (options?.required === false)
    decorators.push(IsOptional({ each: options.each }));

  if (options.required !== false) decorators.push(IsDefined());

  if (options.nullable) decorators.push(IsNullable());
  else decorators.push(NotEquals(null));

  if (options.swagger !== false) {
    const { required = true, ...apiOptions } = options;
    decorators.push(
      ApiProperty({
        type: () => getClass(),
        required: !!required,
        ...apiOptions,
      }),
    );
  }

  return applyDecorators(...decorators);
}

export function StringArrayField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  const decorators = [IsArray(), StringField({ each: true, ...options })];

  decorators.push(ToSplit());

  return applyDecorators(...decorators);
}

export function EmailField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  const decorators = [
    IsEmail(),
    StringField({ toLowerCase: true, swagger: false, ...options }),
  ];

  if (options.swagger !== false) {
    const { required = true, ...apiOptions } = options;
    decorators.push(
      ApiProperty({ type: String, required: !!required, ...apiOptions }),
    );
  }

  return applyDecorators(...decorators);
}

export function PasswordField(
  options: Omit<ApiPropertyOptions, 'type' | 'minLength'> &
    IStringFieldOptions = {},
): PropertyDecorator {
  const decorators = [StringField({ ...options, minLength: 8 }), IsPassword()];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  return applyDecorators(...decorators);
}

export function EnumField<TEnum extends object>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type' | 'enum' | 'isArray'> &
    IEnumFieldOptions = {},
): PropertyDecorator {
  const decorators = [IsEnum(getEnum(), { each: options.each })];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.swagger !== false) {
    const { required = true, ...apiOptions } = options;
    decorators.push(
      ApiProperty({
        enum: getEnum(),
        enumName: options.enumName || getVariableName(getEnum),
        isArray: options.each,
        required: !!required,
        ...apiOptions,
      }),
    );
  }

  return applyDecorators(...decorators);
}

function getVariableName(variableFunction: () => any) {
  return variableFunction.toString().split('.').pop();
}
