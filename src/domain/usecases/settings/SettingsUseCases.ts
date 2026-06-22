/**
 * src/domain/usecases/settings/SettingsUseCases.ts
 * Mục đích: Đọc/ghi cấu hình ứng dụng (theme, ngôn ngữ, tốc độ/cao độ, giọng, hồ sơ active).
 *           (FR-11, FR-12, FR-13, FR-14)
 * Dependency: BaseUseCase, ISettingsRepository, AppSettings, constants.
 */
import {BaseUseCase, NoParams} from '@core/base/BaseUseCase';
import {ISettingsRepository} from '@domain/repositories/ISettingsRepository';
import {AppSettings} from '@domain/entities/Setting';
import {Defaults, SettingKey} from '@core/constants';
import {AppThemeName} from '@core/theme';
import {AppLanguage} from '@core/i18n';
import {clamp} from '@core/utils/validators';

export class GetSettingsUseCase extends BaseUseCase<NoParams, AppSettings> {
  constructor(private readonly repo: ISettingsRepository) {
    super();
  }
  async execute(): Promise<AppSettings> {
    const all = await this.repo.getAll();
    const theme = (all[SettingKey.THEME] as AppThemeName) || Defaults.THEME;
    const language =
      (all[SettingKey.LANGUAGE] as AppLanguage) || Defaults.LANGUAGE;
    const rate = all[SettingKey.SPEECH_RATE]
      ? Number(all[SettingKey.SPEECH_RATE])
      : Defaults.SPEECH_RATE;
    const pitch = all[SettingKey.SPEECH_PITCH]
      ? Number(all[SettingKey.SPEECH_PITCH])
      : Defaults.SPEECH_PITCH;
    const voiceId = all[SettingKey.VOICE_ID] || null;
    const activeRaw = all[SettingKey.ACTIVE_CHILD_ID];
    const activeChildId = activeRaw ? Number(activeRaw) : null;

    return {
      theme,
      language,
      speech: {rate, pitch, voiceId},
      activeChildId,
    };
  }
}

export class UpdateSettingsUseCase extends BaseUseCase<
  Partial<{
    theme: AppThemeName;
    language: AppLanguage;
    rate: number;
    pitch: number;
    voiceId: string | null;
  }>,
  void
> {
  constructor(private readonly repo: ISettingsRepository) {
    super();
  }
  async execute(
    input: Partial<{
      theme: AppThemeName;
      language: AppLanguage;
      rate: number;
      pitch: number;
      voiceId: string | null;
    }>,
  ): Promise<void> {
    if (input.theme) {
      await this.repo.set(SettingKey.THEME, input.theme);
    }
    if (input.language) {
      await this.repo.set(SettingKey.LANGUAGE, input.language);
    }
    if (input.rate !== undefined) {
      await this.repo.set(
        SettingKey.SPEECH_RATE,
        String(clamp(input.rate, 0.1, 1.0)),
      );
    }
    if (input.pitch !== undefined) {
      await this.repo.set(
        SettingKey.SPEECH_PITCH,
        String(clamp(input.pitch, 0.5, 2.0)),
      );
    }
    if (input.voiceId !== undefined) {
      if (input.voiceId === null) {
        await this.repo.remove(SettingKey.VOICE_ID);
      } else {
        await this.repo.set(SettingKey.VOICE_ID, input.voiceId);
      }
    }
  }
}
