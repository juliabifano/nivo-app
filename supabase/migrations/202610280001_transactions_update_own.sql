-- Execute no SQL Editor do projeto Supabase usado pelo app.
-- Permite editar somente transacoes pertencentes ao usuario autenticado.
-- Nao modifica dados financeiros nem remove politicas existentes.
begin;

do $$
begin
  if not exists (
    select 1 from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname = 'transactions' and c.relrowsecurity
  ) then
    raise exception 'A tabela public.transactions precisa estar com RLS ativo. Revise a configuracao antes de aplicar esta politica.';
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'transactions'
      and policyname = 'nivo_transactions_update_own'
  ) then
    create policy nivo_transactions_update_own
      on public.transactions
      for update
      to authenticated
      using ((select auth.uid()) = user_id)
      with check ((select auth.uid()) = user_id);
  end if;
end;
$$;

commit;

-- A politica SELECT do proprio usuario tambem e necessaria.
-- A listagem do app ja depende dela. Resultado para conferir as regras:
select policyname, cmd, roles, permissive, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'transactions'
order by policyname;
