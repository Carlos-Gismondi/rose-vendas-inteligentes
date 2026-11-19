-- NATURÉ VENDAS INTELIGENTES
-- Etapa 02.01 | Banco nature | Modelo homologado
-- MariaDB / InnoDB / utf8mb4
-- Execute em banco novo. Não inclui DROP TABLE nem DROP DATABASE.

CREATE DATABASE IF NOT EXISTS `nature`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `nature`;

CREATE TABLE IF NOT EXISTS `clientes_classificacoes` (
  `id` TINYINT UNSIGNED NOT NULL,
  `nome` VARCHAR(30) NOT NULL,
  `descricao` VARCHAR(200) NULL,
  `ordem` TINYINT UNSIGNED NOT NULL,
  `ativo` BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_classificacao_nome` (`nome`),
  UNIQUE KEY `uq_classificacao_ordem` (`ordem`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `clientes_classificacoes` (`id`,`nome`,`descricao`,`ordem`,`ativo`) VALUES
(1,'Bronze','Cliente iniciante',1,1),
(2,'Prata','Cliente recorrente',2,1),
(3,'Ouro','Cliente de alto volume',3,1),
(4,'Diamante','Cliente estratégico',4,1)
ON DUPLICATE KEY UPDATE `nome`=VALUES(`nome`), `descricao`=VALUES(`descricao`),
 `ordem`=VALUES(`ordem`), `ativo`=VALUES(`ativo`);

CREATE TABLE IF NOT EXISTS `clientes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(12) NULL,
  `tipo_cliente` ENUM('revendedor','empresa') NOT NULL,
  `tipo_pessoa` ENUM('fisica','juridica') NOT NULL,
  `nome` VARCHAR(150) NOT NULL,
  `nome_fantasia` VARCHAR(150) NULL,
  `cpf_cnpj` VARCHAR(14) NULL,
  `inscricao_estadual` VARCHAR(20) NULL,
  `data_nascimento` DATE NULL,
  `classificacao_id` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `situacao` ENUM('ativo','inativo') NOT NULL DEFAULT 'ativo',
  `origem_cliente` VARCHAR(80) NULL,
  `observacoes` TEXT NULL,
  `criado_por` BIGINT UNSIGNED NULL COMMENT 'ID de usuario; FK quando modulo de usuarios existir',
  `atualizado_por` BIGINT UNSIGNED NULL COMMENT 'ID de usuario; FK quando modulo de usuarios existir',
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `arquivado_em` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_clientes_codigo` (`codigo`),
  UNIQUE KEY `uq_clientes_documento` (`cpf_cnpj`),
  KEY `idx_clientes_tipo` (`tipo_cliente`),
  KEY `idx_clientes_situacao` (`situacao`),
  KEY `idx_clientes_classificacao` (`classificacao_id`),
  KEY `idx_clientes_nome` (`nome`),
  CONSTRAINT `fk_clientes_classificacao` FOREIGN KEY (`classificacao_id`)
    REFERENCES `clientes_classificacoes` (`id`),
  CONSTRAINT `chk_clientes_tipo_pessoa` CHECK (`tipo_cliente` <> 'empresa' OR `tipo_pessoa` = 'juridica'),
  CONSTRAINT `chk_clientes_documento_formato` CHECK (
    `cpf_cnpj` IS NULL OR
    (`tipo_pessoa` = 'fisica' AND `cpf_cnpj` REGEXP '^[0-9]{11}$') OR
    (`tipo_pessoa` = 'juridica' AND `cpf_cnpj` REGEXP '^[0-9]{14}$')
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `clientes_contatos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cliente_id` BIGINT UNSIGNED NOT NULL,
  `responsavel` VARCHAR(150) NULL,
  `telefone_principal` VARCHAR(11) NOT NULL,
  `whatsapp` VARCHAR(11) NULL,
  `telefone_secundario` VARCHAR(11) NULL,
  `email` VARCHAR(150) NULL,
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_contatos_cliente` (`cliente_id`),
  CONSTRAINT `fk_contatos_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
  CONSTRAINT `chk_contatos_telefone` CHECK (`telefone_principal` REGEXP '^[0-9]{10,11}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `clientes_enderecos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cliente_id` BIGINT UNSIGNED NOT NULL,
  `cep` CHAR(8) NOT NULL,
  `logradouro` VARCHAR(150) NOT NULL,
  `numero` VARCHAR(20) NOT NULL,
  `complemento` VARCHAR(100) NULL,
  `bairro` VARCHAR(100) NOT NULL,
  `cidade` VARCHAR(100) NOT NULL,
  `uf` CHAR(2) NOT NULL,
  `referencia` VARCHAR(200) NULL,
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_enderecos_cliente` (`cliente_id`),
  CONSTRAINT `fk_enderecos_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
  CONSTRAINT `chk_enderecos_cep` CHECK (`cep` REGEXP '^[0-9]{8}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `clientes_interacoes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cliente_id` BIGINT UNSIGNED NOT NULL,
  `tipo` ENUM('ligacao','whatsapp','email','visita','atendimento','observacao') NOT NULL,
  `descricao` TEXT NOT NULL,
  `data_interacao` DATETIME NOT NULL,
  `usuario_id` BIGINT UNSIGNED NULL COMMENT 'FK quando modulo de usuarios existir',
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_interacoes_cliente_data` (`cliente_id`,`data_interacao`),
  CONSTRAINT `fk_interacoes_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `clientes_preferencias` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cliente_id` BIGINT UNSIGNED NOT NULL,
  `categoria` VARCHAR(100) NOT NULL,
  `descricao` VARCHAR(250) NULL,
  `criado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_preferencias_cliente` (`cliente_id`),
  CONSTRAINT `fk_preferencias_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `configuracoes_clientes` (
  `id` TINYINT UNSIGNED NOT NULL,
  `cpf_obrigatorio` BOOLEAN NOT NULL DEFAULT FALSE,
  `cnpj_obrigatorio` BOOLEAN NOT NULL DEFAULT FALSE,
  `atualizado_em` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `chk_config_clientes_unica` CHECK (`id` = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `configuracoes_clientes`
 (`id`,`cpf_obrigatorio`,`cnpj_obrigatorio`) VALUES (1,0,0);

-- Observações para a futura API:
-- 1. Gerar codigo CLI000001 com transacao: INSERT cliente; obter insert_id;
--    UPDATE clientes SET codigo = CONCAT('CLI', LPAD(id, 6, '0')) WHERE id = insert_id;
--    validar limite de 999999 antes de gerar o codigo.
-- 2. Inserir cliente, contato e endereco na mesma transacao; COMMIT somente ao final.
-- 3. Validar digitos verificadores CPF/CNPJ, email, UF, obrigatoriedade condicional
--    e responsavel de empresa na API. CHECK de documento valida apenas formato.
-- 4. IDs criado_por, atualizado_por e usuario_id aguardam modulo de usuarios.
-- 5. O banco nao garante sozinho que todo cliente tenha contato/endereco;
--    a API deve garantir essa regra transacionalmente.
