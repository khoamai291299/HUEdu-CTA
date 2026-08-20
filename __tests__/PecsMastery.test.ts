/**
 * __tests__/PecsMastery.test.ts
 * Mục đích: Kiểm thử thuật toán nâng cấp level Bước 1 PECS
 *           (cửa sổ 20 lượt gần nhất, ngưỡng 80%, tiêu chí "Độc lập" < 5 giây).
 */
import {
  computePecsMastery,
  isIndependentAttempt,
} from '@domain/usecases/pecs/PecsUseCases';
import {PecsInteraction} from '@domain/entities/PecsInteraction';
import {Pecs} from '@core/constants';

let seq = 0;
const attempt = (params: {
  isSuccess: boolean;
  responseMs: number;
  cancelCount?: number;
}): PecsInteraction => {
  const cancelCount = params.cancelCount ?? 0;
  seq += 1;
  return new PecsInteraction({
    id: seq,
    childId: 1,
    cardId: 10,
    occurredAt: 1_700_000_000_000 + seq,
    responseMs: params.responseMs,
    isSuccess: params.isSuccess,
    isIndependent: isIndependentAttempt({
      isSuccess: params.isSuccess,
      responseMs: params.responseMs,
      cancelCount,
    }),
    cancelCount,
    inputKind: 'drag',
  });
};

const independent = () => attempt({isSuccess: true, responseMs: 1500});
const slowSuccess = () => attempt({isSuccess: true, responseMs: 8000});
const failure = () => attempt({isSuccess: false, responseMs: 12000});

describe('isIndependentAttempt', () => {
  it('tính là độc lập khi thành công, dưới 5 giây, không hủy kéo', () => {
    expect(
      isIndependentAttempt({isSuccess: true, responseMs: 4999, cancelCount: 0}),
    ).toBe(true);
  });

  it('không độc lập khi vượt quá 5 giây', () => {
    expect(
      isIndependentAttempt({isSuccess: true, responseMs: 5000, cancelCount: 0}),
    ).toBe(false);
  });

  it('không độc lập khi có thao tác hủy kéo giữa chừng', () => {
    expect(
      isIndependentAttempt({isSuccess: true, responseMs: 1000, cancelCount: 1}),
    ).toBe(false);
  });

  it('không độc lập khi lượt đó thất bại', () => {
    expect(
      isIndependentAttempt({isSuccess: false, responseMs: 800, cancelCount: 0}),
    ).toBe(false);
  });
});

describe('computePecsMastery', () => {
  it('chưa bật cờ khi chưa đủ 20 lượt, dù toàn bộ đều độc lập', () => {
    const result = computePecsMastery(
      Array.from({length: 19}, () => independent()),
    );
    expect(result.total).toBe(19);
    expect(result.independentRate).toBe(1);
    expect(result.isReadyForNextStage).toBe(false);
  });

  it('bật cờ khi đủ 20 lượt và tỷ lệ độc lập đúng bằng 80%', () => {
    const list = [
      ...Array.from({length: 16}, () => independent()),
      ...Array.from({length: 4}, () => failure()),
    ];
    const result = computePecsMastery(list);
    expect(result.total).toBe(Pecs.WINDOW_SIZE);
    expect(result.independentCount).toBe(16);
    expect(result.independentRate).toBeCloseTo(0.8);
    expect(result.isReadyForNextStage).toBe(true);
  });

  it('không bật cờ khi tỷ lệ độc lập là 75%', () => {
    const list = [
      ...Array.from({length: 15}, () => independent()),
      ...Array.from({length: 5}, () => failure()),
    ];
    expect(computePecsMastery(list).isReadyForNextStage).toBe(false);
  });

  it('thành công nhưng chậm/cần hỗ trợ thì không đủ điều kiện nâng cấp', () => {
    const list = Array.from({length: 20}, () => slowSuccess());
    const result = computePecsMastery(list);
    expect(result.successRate).toBe(1);
    expect(result.independentRate).toBe(0);
    expect(result.isReadyForNextStage).toBe(false);
  });

  it('chỉ xét 20 lượt gần nhất, bỏ qua phần dư phía sau', () => {
    // 20 lượt độc lập mới nhất đứng đầu mảng, 30 lượt thất bại cũ hơn ở cuối.
    const list = [
      ...Array.from({length: 20}, () => independent()),
      ...Array.from({length: 30}, () => failure()),
    ];
    const result = computePecsMastery(list);
    expect(result.total).toBe(20);
    expect(result.isReadyForNextStage).toBe(true);
  });

  it('mảng rỗng trả về 0, không chia cho 0', () => {
    const result = computePecsMastery([]);
    expect(result.total).toBe(0);
    expect(result.successRate).toBe(0);
    expect(result.independentRate).toBe(0);
    expect(result.isReadyForNextStage).toBe(false);
  });
});
