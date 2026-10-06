import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.planId || !body.companyEmail) {
      return NextResponse.json({
        success: false,
        error: 'ID do plano e E-mail da empresa são obrigatórios.',
      }, { status: 400 });
    }

    const subscription = store.subscribeCompanyToPlan(
      body.companyEmail,
      body.planId,
      body.paymentMethod || 'PIX'
    );

    return NextResponse.json({
      success: true,
      data: subscription,
      message: `Plano ${subscription.planName} ativado com sucesso!`,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro ao processar assinatura do plano',
    }, { status: 500 });
  }
}
