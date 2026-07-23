import os
import psycopg2
import csv
from datetime import datetime

DB_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/coopelos')
COOP_ID = '895e1dca-1cb0-4368-89b6-5d535f44c303'
CSV_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'docs', 'Cooperados_2026-05-25_12-57-11.csv')

conn = psycopg2.connect(DB_URL)
cur = conn.cursor()

# Delete existing entries
cur.execute("DELETE FROM cooperado; DELETE FROM adhesion_form;")
conn.commit()


def parse_date(d):
    try:
        return datetime.strptime(d, '%d/%m/%Y').date()
    except Exception:
        return None

with open(CSV_PATH, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        nome_cooperado = row.get('Nome do Cooperado','').strip()
        if not nome_cooperado:
            continue
        cpf_cooperado = row.get('CPF Cooperado','').strip()
        rg = row.get('RG','').strip()
        nascimento = parse_date(row.get('Nascimento',''))
        civil_raw = row.get('Estado Civil','').strip()
        if civil_raw == 'Casado(a)':
            estado_civil = 'married'
        elif civil_raw == 'Solteiro(a)':
            estado_civil = 'single'
        elif civil_raw == 'Divorciado(a)':
            estado_civil = 'divorced'
        else:
            estado_civil = 'other'
        escolaridade = row.get('Escolaridade','').strip()
        nome_pai = row.get('Nome do Pai','').strip()
        nome_mae = row.get('Nome do Mãe','').strip()
        celular_cooperado = row.get('Celular Cooperado','').strip()
        telefone_residencial = row.get('Telefone Residencial','').strip()
        email_cooperado = row.get('E-mail coop','').strip()
        endereco = row.get('Endereço','').strip()
        bairro = row.get('Bairro','').strip()
        complemento = row.get('Complemento','').strip()
        cep = row.get('CEP','').strip()
        cidade = row.get('Cidade','').strip()
        estado = row.get('Estado','').strip()
        data_admissao = parse_date(row.get('Data de admissão',''))
        sexo_raw = row.get('Sexo','').strip()
        if sexo_raw == 'Masculino':
            sexo = 'masculine'
        elif sexo_raw == 'Feminino':
            sexo = 'feminine'
        else:
            sexo = None
        cur.execute(
            "INSERT INTO cooperado (cooperative_id, nome_cooperado, cpf_cooperado, rg, nascimento, estado_civil, escolaridade, nome_pai, nome_mae, celular_cooperado, telefone_residencial, email_cooperado, endereco, bairro, complemento, cep, cidade, estado, sexo, data_admissao, status) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (COOP_ID, nome_cooperado, cpf_cooperado, rg, nascimento, estado_civil, escolaridade, nome_pai, nome_mae, celular_cooperado, telefone_residencial, email_cooperado, endereco, bairro, complemento, cep, cidade, estado, sexo, data_admissao, 'active'))
conn.commit()
print('Inserted rows: ', cur.rowcount)
cur.close(); conn.close()
