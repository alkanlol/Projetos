from flask import Flask, render_template
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

app = Flask(__name__)

# Carregar CSV
df = pd.read_csv('dataset/global_ecological_footprint_2023.csv', encoding='latin1')

# Remover símbolos de $ e , da coluna correta e converter para float
df['GDP per Capita'] = df['GDP per Capita'].replace(r'[\$,]', '', regex=True).astype(float)

# Remover valores ausentes nas colunas usadas
df = df.dropna(subset=['HDI', 'Population (millions)', 'Region', 'GDP per Capita'])

# Criar pasta para gráficos
os.makedirs('static/plots', exist_ok=True)

# Cálculos
mean_hdi = df['HDI'].mean()
hdi_maior_10mi = df[df['Population (millions)'] > 10]['HDI'].mean()

# Histograma PIB
plt.figure(figsize=(8, 6))
sns.histplot(df['GDP per Capita'], bins=10, kde=True)
plt.title('Distribuição do PIB per Capita')
plt.xlabel('PIB per Capita (USD)')
plt.ylabel('Frequência')
plt.tight_layout()
plt.savefig('static/plots/histograma_gdp.png')
plt.close()

# Correlação HDI x PIB
plt.figure(figsize=(8, 6))
sns.scatterplot(data=df, x='HDI', y='GDP per Capita')
plt.title('Correlação entre HDI e PIB per Capita')
plt.xlabel('HDI')
plt.ylabel('PIB per Capita (USD)')
plt.tight_layout()
plt.savefig('static/plots/correlacao_hdi_gdp.png')
plt.close()

# População por região
pop_regiao = df.groupby('Region')['Population (millions)'].sum()
plt.figure(figsize=(7, 7))
pop_regiao.plot.pie(autopct='%1.1f%%')
plt.title('Distribuição da População por Região')
plt.ylabel('')
plt.tight_layout()
plt.savefig('static/plots/populacao_regiao.png')
plt.close()

@app.route('/')
def index():
    return render_template('index.html',
                           media_hdi=round(mean_hdi, 3),
                           hdi_maior_10mi=round(hdi_maior_10mi, 3))

if __name__ == '__main__':
    app.run(debug=True)
