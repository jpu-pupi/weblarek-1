import { IBuyer, TPayment } from "../../../types";

export class Buyer {
    private payment: TPayment = '';
    private email: string = '';
    private phone: string = '';
    private address: string = '';

    setPayment(payment: TPayment): void {
        this.payment = payment;
    }

    setEmail(email: string): void {
        this.email = email;
    }

    setPhone(phone: string): void {
        this.phone = phone;
    }

    setAddress(address: string): void {
        this.address = address;
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address
        };
    }

    clear(): void {
        this.payment = ''
        this.email = ''
        this.phone = ''
        this.address = ''
    }

    validateStep1(): { payment?: string; address?: string } {

        const errors: { payment?: string; address?: string } = {};

        if (!this.payment) errors.payment = 'Не выбран способ оплаты';
        if (!this.address.trim()) errors.address = 'Введите адрес доставки';
        return errors;
    }

    validateStep2(): { email?: string; phone?: string } {

        const errors: { email?: string; phone?: string } = {};
        if (!this.email.trim()) errors.email = 'Введите email';
        if (!this.phone.trim()) errors.phone = 'Введите телефон';
        return errors;
    }
}