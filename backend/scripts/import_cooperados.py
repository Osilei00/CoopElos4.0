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
cur.execute("DELETE FROM collaborator; DELETE FROM adhesion_form;")
conn.commit()


def parse_date(d):
    try:
        return datetime.strptime(d, '%d/%m/%Y').date()
    except Exception:
        return None

with open(CSV_PATH, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        full_name = row.get('Nome do Cooperado','').strip()
        if not full_name:
            continue
        cpf = row.get('CPF Cooperado','').strip()
        rg = row.get('RG','').strip()
        birth = parse_date(row.get('Nascimento',''))
        civil_raw = row.get('Estado Civil','').strip()
        if civil_raw == 'Casado(a)':
            civil = 'married'
        elif civil_raw == 'Solteiro(a)':
            civil = 'single'
        elif civil_raw == 'Divorciado(a)':
            civil = 'divorced'
        else:
            civil = 'other'
        edu = row.get('Escolaridade','').strip()
        father = row.get('Nome do Pai','').strip()
        mother = row.get('Nome do Mãe','').strip()
        mobile = row.get('Celular Cooperado','').strip()
        home = row.get('Telefone Residencial','').strip()
        email = row.get('E-mail coop','').strip()
        address = row.get('Endereço','').strip()
        neighborhood = row.get('Bairro','').strip()
        complement = row.get('Complemento','').strip()
        postal = row.get('CEP','').strip()
        city = row.get('Cidade','').strip()
        state = row.get('Estado','').strip()
        admission = parse_date(row.get('Data de admissão',''))
        gender_raw = row.get('Sexo','').strip()
        if gender_raw == 'Masculino':
            gender = 'masculine'
        elif gender_raw == 'Feminino':
            gender = 'feminine'
        else:
            gender = None
        cur.execute(
            "INSERT INTO collaborator (cooperative_id, full_name, cpf, rg, birth_date, marital_status, education_level, father_name, mother_name, mobile_phone, home_phone, email, address, neighborhood, address_complement, postal_code, city, state, gender, admission_date, status) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (COOP_ID, full_name, cpf, rg, birth, civil, edu, father, mother, mobile, home, email, address, neighborhood, complement, postal, city, state, gender, admission, 'active'))
conn.commit()
print('Inserted rows: ', cur.rowcount)
cur.close(); conn.close()
