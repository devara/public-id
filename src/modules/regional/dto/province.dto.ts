import { Exclude } from 'class-transformer';
import { RegionalDto } from './regional.dto';

@Exclude()
export class ProvinceDto extends RegionalDto {}
