import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
const fake = vi.hoisted(() => ({ addService: vi.fn(), submitAdInquiry: vi.fn(), closeService: vi.fn(), closeAd: vi.fn() }));
vi.mock('../src/context/AppContext.tsx', () => ({
  useApp: () => ({
    language: 'ar', t: { addServiceBtn: 'إضافة خدمة', cancel: 'إلغاء' },
    isAddModalOpen: true, setIsAddModalOpen: fake.closeService, addService: fake.addService,
    isAdInquiryModalOpen: true, setIsAdInquiryModalOpen: fake.closeAd,
    showToast: vi.fn(), submitAdInquiry: fake.submitAdInquiry
  })
}));
import { AddServiceModal } from '../src/components/AddServiceModal';
import { AdInquiryModal } from '../src/components/AdInquiryModal';
beforeEach(() => { vi.clearAllMocks(); });
afterEach(cleanup);
it('keeps a failed service form open with the entered contact details', async () => {
  fake.addService.mockRejectedValue(new Error('offline'));
  const { container } = render(<AddServiceModal />);
  const name = container.querySelector('#service-name-input') as HTMLInputElement;
  fireEvent.change(name, { target: { value: 'نشاط للاختبار' } });
  const required = [...container.querySelectorAll('input[required]')] as HTMLInputElement[];
  required.filter(input => input !== name).forEach(input => fireEvent.change(input, { target: { value: input.type === 'tel' ? '0600000000' : 'حرفي' } }));
  fireEvent.submit(container.querySelector('form')!);
  await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('تعذر إرسال'));
  expect(name.value).toBe('نشاط للاختبار');
  expect(fake.closeService).not.toHaveBeenCalled();
});
it('does not show an advertising success screen after a rejected write', async () => {
  fake.submitAdInquiry.mockRejectedValue(new Error('permission-denied'));
  const { container } = render(<AdInquiryModal />);
  const required = [...container.querySelectorAll('input[required]')] as HTMLInputElement[];
  required.forEach(input => fireEvent.change(input, { target: { value: input.type === 'tel' ? '0600000000' : 'نشاط للاختبار' } }));
  fireEvent.submit(container.querySelector('form')!);
  await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('لم يتم إرسال'));
  expect(container.querySelector('form')).not.toBeNull();
  expect(fake.closeAd).not.toHaveBeenCalled();
  expect(screen.queryByText('تم استلام طلب حجز المساحة الإعلانية بنجاح')).toBeNull();
});
