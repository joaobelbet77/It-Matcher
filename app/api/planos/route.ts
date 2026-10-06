import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/storage';

export async function GET() {
  try {
    const plans = store.getPlans();
    return NextResponse.json({ success: true, data: plans });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao buscar planos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || body.price === undefined) {
      return NextResponse.json({
        success: false,
        error: 'Nome do plano e Preço são obrigatórios.',
      }, { status: 400 });
    }

    const newPlan = store.createPlan({
      name: body.name,
      description: body.description || '',
      price: Number(body.price),
      period: body.period || 'mês',
      features: Array.isArray(body.features) ? body.features : (body.features ? body.features.split('\n').filter(Boolean) : []),
      maxJobs: body.maxJobs !== undefined ? Number(body.maxJobs) : 5,
      maxMatches: body.maxMatches !== undefined ? Number(body.maxMatches) : -1,
      status: body.status || 'active',
      isPopular: !!body.isPopular,
      badge: body.badge || '',
    });

    return NextResponse.json({ success: true, data: newPlan }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Erro ao criar plano' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({
        success: false,
        error: 'ID do plano é obrigatório.',
      }, { status: 400 });
    }

    const updatedPlan = store.updatePlan({
      ...body,
      features: Array.isArray(body.features) ? body.features : (body.features ? body.features.split('\n').filter(Boolean) : undefined),
    });

    return NextResponse.json({ success: true, data: updatedPlan });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Erro ao atualizar plano' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID do plano é obrigatório' }, { status: 400 });
    }

    const deleted = store.deletePlan(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Plano não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Plano excluído com sucesso' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Erro ao excluir plano' }, { status: 500 });
  }
}
