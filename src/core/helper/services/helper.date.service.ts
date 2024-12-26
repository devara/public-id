import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DateObjectUnits, DateTime, Duration } from 'luxon';
import { IHelperDateCreateOptions } from '../interfaces/helper.interface';
import { ENUM_HELPER_DATE_DAY_OF } from '../enums/helper.enum';
import { AvailableConfigType } from 'src/config/config.type';

@Injectable()
export class HelperDateService {
  private readonly defTz: string;

  constructor(
    private readonly configService: ConfigService<AvailableConfigType>,
  ) {
    this.defTz = this.configService.get<string>('app.timezone', {
      infer: true,
    });
  }

  checkIso(date: string): boolean {
    return DateTime.fromISO(date).setZone(this.defTz).isValid;
  }

  checkTimestamp(timestamp: number): boolean {
    return DateTime.fromMillis(timestamp).setZone(this.defTz).isValid;
  }

  getZone(date: Date): string {
    return DateTime.fromJSDate(date).setZone(this.defTz).zone.name;
  }

  getZoneOffset(date: Date): string {
    return DateTime.fromJSDate(date).setZone(this.defTz).offsetNameShort;
  }

  getTimestamp(date: Date): number {
    return DateTime.fromJSDate(date).setZone(this.defTz).toMillis();
  }

  formatToRFC2822(date: Date): string {
    return DateTime.fromJSDate(date).setZone(this.defTz).toRFC2822();
  }

  formatToIso(date: Date): string {
    return DateTime.fromJSDate(date).setZone(this.defTz).toISO();
  }

  formatToIsoDate(date: Date): string {
    return DateTime.fromJSDate(date).setZone(this.defTz).toISODate();
  }

  formatToIsoTime(date: Date): string {
    return DateTime.fromJSDate(date).setZone(this.defTz).toISOTime();
  }

  create(date?: Date, options?: IHelperDateCreateOptions): Date {
    const mDate = date
      ? DateTime.fromJSDate(date).setZone(this.defTz)
      : DateTime.now().setZone(this.defTz);

    if (options?.dayOf && options?.dayOf === ENUM_HELPER_DATE_DAY_OF.START) {
      mDate.startOf('day');
    } else if (
      options?.dayOf &&
      options?.dayOf === ENUM_HELPER_DATE_DAY_OF.END
    ) {
      mDate.endOf('day');
    }

    return mDate.toJSDate();
  }

  createInstance(date?: Date): DateTime {
    return date ? DateTime.fromJSDate(date) : DateTime.now();
  }

  createFromIso(iso: string, options?: IHelperDateCreateOptions): Date {
    const date = DateTime.fromISO(iso).setZone(this.defTz);

    if (options?.dayOf && options?.dayOf === ENUM_HELPER_DATE_DAY_OF.START) {
      date.startOf('day');
    } else if (
      options?.dayOf &&
      options?.dayOf === ENUM_HELPER_DATE_DAY_OF.END
    ) {
      date.endOf('day');
    }

    return date.toJSDate();
  }

  createFromTimestamp(
    timestamp?: number,
    options?: IHelperDateCreateOptions,
  ): Date {
    const date = timestamp
      ? DateTime.fromMillis(timestamp).setZone(this.defTz)
      : DateTime.now().setZone(this.defTz);

    if (options?.dayOf && options?.dayOf === ENUM_HELPER_DATE_DAY_OF.START) {
      date.startOf('day');
    } else if (
      options?.dayOf &&
      options?.dayOf === ENUM_HELPER_DATE_DAY_OF.END
    ) {
      date.endOf('day');
    }

    return date.toJSDate();
  }

  set(date: Date, units: DateObjectUnits): Date {
    return DateTime.fromJSDate(date).setZone(this.defTz).set(units).toJSDate();
  }

  forward(date: Date, duration: Duration): Date {
    return DateTime.fromJSDate(date)
      .setZone(this.defTz)
      .plus(duration)
      .toJSDate();
  }

  backward(date: Date, duration: Duration): Date {
    return DateTime.fromJSDate(date)
      .setZone(this.defTz)
      .minus(duration)
      .toJSDate();
  }
}
