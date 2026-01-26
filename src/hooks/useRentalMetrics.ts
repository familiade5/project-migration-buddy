import { useMemo } from 'react';
import { RentalContract, RentalPayment, getTotalMonthly, getPaymentTotal } from '@/types/rental';

export interface RentalMetrics {
  // Contract metrics
  totalContracts: number;
  activeContracts: number;
  endingSoonContracts: number;
  expiredContracts: number;
  
  // Financial metrics - Expected
  expectedMonthlyRevenue: number;
  expectedManagementFees: number;
  
  // Financial metrics - Received
  totalReceivedThisMonth: number;
  totalReceivedThisYear: number;
  
  // Financial metrics - Pending/Overdue
  totalPendingThisMonth: number;
  totalOverdue: number;
  overdueCount: number;
  
  // Delinquency
  delinquencyRate: number; // Percentage of overdue payments
  
  // By responsible user
  byResponsible: Record<string, {
    userId: string;
    userName: string;
    contractCount: number;
    totalValue: number;
    overdueCount: number;
    overdueValue: number;
  }>;
  
  // Monthly trend
  monthlyTrend: {
    month: number;
    year: number;
    expected: number;
    received: number;
    pending: number;
  }[];
}

export function useRentalMetrics(
  contracts: RentalContract[],
  payments: RentalPayment[]
): RentalMetrics {
  return useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // Contract counts
    const activeContracts = contracts.filter(c => c.status === 'active').length;
    const endingSoonContracts = contracts.filter(c => c.status === 'ending_soon').length;
    const expiredContracts = contracts.filter(c => c.status === 'expired').length;

    // Expected monthly revenue from active contracts
    const activeContractsList = contracts.filter(c => c.status === 'active');
    const expectedMonthlyRevenue = activeContractsList.reduce(
      (sum, c) => sum + getTotalMonthly(c), 
      0
    );
    
    const expectedManagementFees = activeContractsList.reduce(
      (sum, c) => sum + (getTotalMonthly(c) * (c.management_fee_percentage / 100)), 
      0
    );

    // This month's payments
    const thisMonthPayments = payments.filter(
      p => p.reference_month === currentMonth && p.reference_year === currentYear
    );
    
    const totalReceivedThisMonth = thisMonthPayments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + (p.paid_amount || getPaymentTotal(p)), 0);
    
    const totalPendingThisMonth = thisMonthPayments
      .filter(p => p.status === 'pending' || p.status === 'overdue')
      .reduce((sum, p) => sum + getPaymentTotal(p), 0);

    // This year's received
    const totalReceivedThisYear = payments
      .filter(p => p.reference_year === currentYear && p.status === 'paid')
      .reduce((sum, p) => sum + (p.paid_amount || getPaymentTotal(p)), 0);

    // Overdue
    const overduePayments = payments.filter(p => p.status === 'overdue');
    const totalOverdue = overduePayments.reduce((sum, p) => sum + getPaymentTotal(p), 0);
    const overdueCount = overduePayments.length;

    // Delinquency rate
    const totalPaymentsCount = payments.filter(
      p => p.status !== 'cancelled'
    ).length;
    const delinquencyRate = totalPaymentsCount > 0 
      ? (overdueCount / totalPaymentsCount) * 100 
      : 0;

    // By responsible user
    const byResponsible: RentalMetrics['byResponsible'] = {};
    
    for (const contract of contracts) {
      if (!contract.responsible_user_id) continue;
      
      const userId = contract.responsible_user_id;
      const userName = contract.responsible_user?.full_name || 'Não atribuído';
      
      if (!byResponsible[userId]) {
        byResponsible[userId] = {
          userId,
          userName,
          contractCount: 0,
          totalValue: 0,
          overdueCount: 0,
          overdueValue: 0,
        };
      }
      
      byResponsible[userId].contractCount++;
      byResponsible[userId].totalValue += getTotalMonthly(contract);
      
      // Count overdue for this contract
      const contractOverdue = payments.filter(
        p => p.contract_id === contract.id && p.status === 'overdue'
      );
      byResponsible[userId].overdueCount += contractOverdue.length;
      byResponsible[userId].overdueValue += contractOverdue.reduce(
        (sum, p) => sum + getPaymentTotal(p), 0
      );
    }

    // Monthly trend (last 6 months)
    const monthlyTrend: RentalMetrics['monthlyTrend'] = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - 1 - i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      
      const monthPayments = payments.filter(
        p => p.reference_month === month && p.reference_year === year
      );
      
      monthlyTrend.push({
        month,
        year,
        expected: monthPayments.reduce((sum, p) => sum + getPaymentTotal(p), 0),
        received: monthPayments
          .filter(p => p.status === 'paid')
          .reduce((sum, p) => sum + (p.paid_amount || getPaymentTotal(p)), 0),
        pending: monthPayments
          .filter(p => p.status === 'pending' || p.status === 'overdue')
          .reduce((sum, p) => sum + getPaymentTotal(p), 0),
      });
    }

    return {
      totalContracts: contracts.length,
      activeContracts,
      endingSoonContracts,
      expiredContracts,
      expectedMonthlyRevenue,
      expectedManagementFees,
      totalReceivedThisMonth,
      totalReceivedThisYear,
      totalPendingThisMonth,
      totalOverdue,
      overdueCount,
      delinquencyRate,
      byResponsible,
      monthlyTrend,
    };
  }, [contracts, payments]);
}
