/**
 * src/domain/usecases/backup/BackupUseCases.ts
 * Mục đích: Use case xuất/khôi phục dữ liệu (FR-15) - uỷ thác cho IBackupService.
 * Dependency: BaseUseCase, IBackupService.
 */
import {BaseUseCase, NoParams} from '@core/base/BaseUseCase';
import {IBackupService} from '@domain/services/IBackupService';

export class ExportBackupUseCase extends BaseUseCase<NoParams, string> {
  constructor(private readonly backup: IBackupService) {
    super();
  }
  /** Trả về đường dẫn file JSON đã xuất. */
  execute(): Promise<string> {
    return this.backup.exportToFile();
  }
}

export class ImportBackupUseCase extends BaseUseCase<string, void> {
  constructor(private readonly backup: IBackupService) {
    super();
  }
  execute(json: string): Promise<void> {
    return this.backup.importFromJson(json);
  }
}
