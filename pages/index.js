import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Reintroduzido para compatibilidade com Next.js

// Ícones SVG para a barra de navegação (simulando Lucide React)
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const ShoppingCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart">
    <circle cx="8" cy="21" r="1"/>
    <circle cx="19" cy="21" r="1"/>
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
  </svg>
);

const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list">
    <line x1="8" x2="21" y1="6" y2="6"/>
    <line x1="8" x2="21" y1="12" y2="12"/>
    <line x1="8" x2="21" y1="18" y2="18"/>
    <line x1="3" x2="3.01" y1="6" y2="6"/>
    <line x1="3" x2="3.01" y1="12" y2="12"/>
    <line x1="3" x2="3.01" y1="18" y2="18"/>
  </svg>
);

// Ícone de Lixeira
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash">
    <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
  </svg>
);

// Ícone de Seta para Direita (para o botão Editar)
const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-1">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

// Ícone de Seta para Baixo (para expandir/recolher)
const ChevronDownIcon = ({ className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-chevron-down ${className}`}>
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

export default function Home() {
  const router = useRouter(); // Inicializa o useRouter
  const [currentView, setCurrentView] = useState('products');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPersonalizationModal, setShowPersonalizationModal] = useState(false);
  const [personalizationOptions, setPersonalizationOptions] = useState({
    ingredientesPadrao: {
      granola: true,
      pacoça: true,
      caldaChocolate: true,
      banana: true,
      leiteNinho: true,
      chocoball: true,
    },
    adicionaisPagos: {
      pera: false,
      morango: false,
      bananaExtra: false,
    },
    quantidade: 1,
  });
  const [cartItems, setCartItems] = useState([]);
  const [paymentValue, setPaymentValue] = useState(null);
  const [paymentQr, setPaymentQr] = useState(null);
  const [paymentReceiverName, setPaymentReceiverName] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showFloatingCartNotification, setShowFloatingCartNotification] = useState(false);
  const [editingCartItemId, setEditingCartItemId] = useState(null);
  // Novo estado para controlar a expansão dos detalhes do item no carrinho
  const [expandedCartItemDetails, setExpandedCartItemDetails] = useState({});

  // Função para alternar a expansão dos detalhes do item
  const toggleItemDetails = (itemId) => {
    setExpandedCartItemDetails(prevState => ({
      ...prevState,
      [itemId]: !prevState[itemId]
    }));
  };

  // Calcula o total de itens e preço total para a notificação flutuante
  const totalCartItems = cartItems.reduce((total, item) => total + item.personalization.quantidade, 0);
  const totalCartPrice = cartItems.reduce((total, item) => total + item.finalPrice, 0);

  useEffect(() => {
    // Esconder a notificação em páginas específicas ou se o carrinho estiver vazio
    if (totalCartItems === 0 || ['cart', 'payment'].includes(currentView)) {
      setShowFloatingCartNotification(false);
    } else {
      setShowFloatingCartNotification(true);
    }
  }, [totalCartItems, currentView]);

  const handleProductClick = (produto) => {
    setSelectedProduct(produto);
    setCurrentView('productDetail');
  };

  const handlePersonalizeClick = () => {
    setPersonalizationOptions(selectedProduct.personalization || {
      ingredientesPadrao: {
        granola: true, pacoça: true, caldaChocolate: true, banana: true, leiteNinho: true, chocoball: true,
      },
      adicionaisPagos: {
        pera: false, morango: false, bananaExtra: false,
      },
      quantidade: 1,
    });
    setShowPersonalizationModal(true);
  };

  const handleClosePersonalizationModal = () => {
    setShowPersonalizationModal(false);
    setEditingCartItemId(null);
  };

  const handleIngredientChange = (category, ingredient) => {
    setPersonalizationOptions(prevOptions => ({
      ...prevOptions,
      [category]: {
        ...prevOptions[category],
        [ingredient]: !prevOptions[category][ingredient],
      },
    }));
  };

  const handleQuantityChange = (amount) => {
    setPersonalizationOptions(prevOptions => ({
      ...prevOptions,
      quantidade: Math.max(1, prevOptions.quantidade + amount),
    }));
  };

  const calculatePersonalizedPrice = () => {
    if (!selectedProduct) return 0;
    let price = selectedProduct.valor;
    if (personalizationOptions.adicionaisPagos.pera) price += 1.00;
    if (personalizationOptions.adicionaisPagos.morango) price += 2.00;
    if (personalizationOptions.adicionaisPagos.bananaExtra) price += 2.00;
    return price * personalizationOptions.quantidade;
  };

  const handleAddToCart = () => {
    const finalPrice = calculatePersonalizedPrice();
    const newItem = {
      ...selectedProduct,
      personalization: { ...personalizationOptions },
      finalPrice: finalPrice,
    };

    if (editingCartItemId) {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === editingCartItemId ? { ...newItem, id: editingCartItemId } : item
        )
      );
      setEditingCartItemId(null); // Limpa o ID de edição
      setCurrentView('cart'); // Permanece no carrinho após a edição
    } else {
      setCartItems(prevItems => [...prevItems, { ...newItem, id: Date.now() }]);
      setCurrentView('products'); // Volta para a lista de produtos após adicionar novo item
    }
    
    console.log("Itens no carrinho:", cartItems);
    
    setSelectedProduct(null);
    setShowPersonalizationModal(false);
    setPersonalizationOptions({
      ingredientesPadrao: {
        granola: true, pacoça: true, caldaChocolate: true, banana: true, leiteNinho: true, chocoball: true,
      },
      adicionaisPagos: {
        pera: false, morango: false, bananaExtra: false,
      },
      quantidade: 1,
    });
  };

  const handleEditCartItem = (itemToEdit) => {
    setSelectedProduct(itemToEdit);
    setPersonalizationOptions(itemToEdit.personalization);
    setEditingCartItemId(itemToEdit.id);
    setShowPersonalizationModal(true);
  };

  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.finalPrice, 0);
  };

  const handleRemoveFromCart = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Função para atualizar a quantidade de um item no carrinho
  const updateCartItemQuantity = (itemId, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? {
              ...item,
              personalization: { ...item.personalization, quantidade: newQuantity },
              finalPrice: (item.finalPrice / item.personalization.quantidade) * newQuantity, // Recalcula o preço
            }
          : item
      ).filter(item => item.personalization.quantidade > 0) // Remove se a quantidade for 0
    );
  };

  const handleProceedToPayment = () => {
    const total = calculateCartTotal();
    setPaymentValue(total);
    // Gerar um QR Code de exemplo para o total do carrinho
    setPaymentQr("00020101021226580014BR.GOV.BCB.PIX0136a6058d85-f377-40c2-840e-f002d0b5d8f65204000053039865405" + total.toFixed(2).replace('.', '') + "5802BR5913TOTAL%20DO%20PEDIDO6008BRASILIA62070503***63042A68");
    setPaymentReceiverName("Total do Pedido");
    
    // Lógica para Next.js: Navega para a página de finalização com o valor total
    // Certifique-se de que a página `/finalizar` existe no seu projeto Next.js e está configurada para receber o parâmetro 'valor'.
    router.push(`/finalizar?valor=${total.toFixed(2)}`);

    // Lógica para o Canvas: Muda a view para a tela de pagamento (se você quiser manter essa funcionalidade no Canvas)
    // setCurrentView('payment'); 
  };

  const copyToClipboard = () => {
    if (paymentQr) {
      const el = document.createElement('textarea');
      el.value = paymentQr;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const produtos = [
    { nome: 'Açaí 300ml', descricao: 'Delicioso açaí na tigela com frutas', valor: 10, imageUrl: 'https://placehold.co/300x300/A78BFA/FFFFFF?text=A%C3%A7a%C3%AD+300ml', inclui: ['granola', 'paçoca', 'calda de chocolate'] },
    { nome: 'Açaí 500ml', descricao: 'Açaí completo com banana e granola', valor: 15, imageUrl: 'https://placehold.co/300x300/8B5CF6/FFFFFF?text=A%C3%A7a%C3%AD+500ml', inclui: ['granola', 'paçoca', 'calda de chocolate', 'banana', 'leite ninho', 'chocoball'] },
    { nome: 'Copo da Felicidade', descricao: 'Creme de ninho, morango e chocolate', valor: 22.50, imageUrl: 'https://placehold.co/300x300/6D28D9/FFFFFF?text=Copo+Felicidade', inclui: ['creme de ninho', 'morango', 'chocolate'] },
    { nome: 'Milkshake de Ovomaltine', descricao: 'Cremoso e refrescante', valor: 18.00, imageUrl: 'https://placehold.co/300x300/5B21B6/FFFFFF?text=Milkshake', inclui: ['ovomaltine', 'leite', 'sorvete'] },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex flex-col items-center justify-between p-4 font-inter pb-20">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform transition-all duration-500 hover:scale-105 mb-4">
        {currentView === 'products' && (
          <>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Nosso Menu
            </h1>
            {produtos.map((produto, i) => (
              <div
                key={i}
                className="mb-6 p-4 border border-gray-200 rounded-xl shadow-sm text-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer transform hover:scale-102 active:scale-98" // Adicionado text-center
                onClick={() => handleProductClick(produto)}
              >
                <img
                  src={produto.imageUrl}
                  alt={produto.nome}
                  className="w-32 h-32 object-cover rounded-full mb-3 shadow-md mx-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/300x300/E0BBE4/FFFFFF?text=Imagem+Indisponível';
                  }}
                />
                <h2 className="text-2xl font-semibold text-gray-800">{produto.nome}</h2>
                <p className="text-gray-600 mt-1">{produto.descricao}</p>
                <p className="text-xl font-bold text-purple-700 mt-2">
                  R$ {parseFloat(produto.valor).toFixed(2).replace('.', ',')}
                </p>                
                <button
                  onClick={(e) => { e.stopPropagation(); handleProductClick(produto); }} // Chama handleProductClick
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg text-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                >
                  Ver Detalhes
                </button>
              </div>
            ))}
          </>
        )}

        {currentView === 'productDetail' && selectedProduct && (
          <div className="animate-fade-in">
            <button
              onClick={() => setCurrentView('products')}
              className="absolute top-4 left-4 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
                <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
              </svg>
            </button>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
              {selectedProduct.nome}
            </h1>
            <img
              src={selectedProduct.imageUrl}
              alt={selectedProduct.nome}
              className="w-48 h-48 object-cover rounded-full mb-4 shadow-lg mx-auto"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/400x400/E0BBE4/FFFFFF?text=Imagem+Indisponível';
              }}
            />
            <p className="text-gray-700 mb-4">{selectedProduct.descricao}</p>
            <p className="text-2xl font-bold text-purple-700 mb-6">
              R$ {parseFloat(selectedProduct.valor).toFixed(2).replace('.', ',')}
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">Inclui:</h3>
            <ul className="list-disc list-inside text-gray-600 mb-6">
              {selectedProduct.inclui && selectedProduct.inclui.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row justify-around mt-6 space-y-2 sm:space-y-0 sm:space-x-2">
              <button
                onClick={handlePersonalizeClick}
                className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg text-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50 w-full sm:w-auto"
              >
                Personalizar Pedido
              </button>
              <button
                onClick={handleAddToCart}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg text-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 w-full sm:w-auto"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        )}

        {currentView === 'cart' && (
          <div className="animate-fade-in">
            <button
              onClick={() => setCurrentView('products')}
              className="absolute top-4 left-4 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
                <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
              </svg>
            </button>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Seu Carrinho
            </h1>
            {cartItems.length === 0 ? (
              <p className="text-lg text-gray-600">Seu carrinho está vazio.</p>
            ) : (
              <>
                {cartItems.map((item, index) => (
                  <div key={item.id || index} className="mb-4 p-4 border border-gray-200 rounded-xl shadow-sm bg-gray-50 flex flex-col">
                    <div className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        <img
                          src={item.imageUrl}
                          alt={item.nome}
                          className="w-20 h-20 object-cover rounded-full shadow-sm flex-shrink-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/200x200/E0BBE4/FFFFFF?text=Item';
                          }}
                        />
                      </div>
                      <div className="flex-grow text-left">
                        <h3 className="text-xl font-semibold text-gray-800">{item.nome} (x{item.personalization.quantidade})</h3>
                        <p className="text-xl font-bold text-purple-700">R$ {parseFloat(item.finalPrice).toFixed(2).replace('.', ',')}</p>
                        {/* Recuo de informação com seta */}
                        <button
                          onClick={() => toggleItemDetails(item.id)}
                          className="flex items-center text-gray-600 hover:text-gray-900 text-sm mt-1 focus:outline-none"
                        >
                          Detalhes do Pedido
                          <ChevronDownIcon className={expandedCartItemDetails[item.id] ? 'transform rotate-180' : ''} />
                        </button>
                        {/* Detalhes de personalização (expandir/recolher) */}
                        {expandedCartItemDetails[item.id] && (
                          <div className="mt-2 text-left animate-fade-in">
                            {Object.keys(item.personalization.ingredientesPadrao).some(key => !item.personalization.ingredientesPadrao[key]) && (
                              <p className="text-gray-600 text-sm mt-1">
                                Removidos: {Object.keys(item.personalization.ingredientesPadrao).filter(key => !item.personalization.ingredientesPadrao[key]).map(ing => ing.replace(/([A-Z])/g, ' $1').trim()).join(', ')}
                              </p>
                            )}
                            {Object.keys(item.personalization.adicionaisPagos).some(key => item.personalization.adicionaisPagos[key]) && (
                              <p className="text-gray-600 text-sm mt-1">
                                Adicionais: {Object.keys(item.personalization.adicionaisPagos).filter(key => item.personalization.adicionaisPagos[key]).map(add => add.replace(/([A-Z])/g, ' $1').trim()).join(', ')}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      {/* Botão Editar alinhado com a lixeira */}
                      <button
                        onClick={() => handleEditCartItem(item)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center focus:outline-none"
                      >
                        Editar <ArrowRightIcon />
                      </button>

                      {/* Controles de quantidade/lixeira */}
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        {item.personalization.quantidade === 1 ? (
                          <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="bg-gray-100 hover:bg-gray-200 text-red-500 font-bold py-2 px-3 transition-colors duration-200"
                          >
                            <TrashIcon />
                          </button>
                        ) : (
                          <button
                            onClick={() => updateCartItemQuantity(item.id, item.personalization.quantidade - 1)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-3 transition-colors duration-200"
                          >
                            -
                          </button>
                        )}
                        <span className="bg-white text-gray-900 font-bold py-2 px-4 text-sm">
                          {item.personalization.quantidade}
                        </span>
                        <button
                          onClick={() => updateCartItemQuantity(item.id, item.personalization.quantidade + 1)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-3 transition-colors duration-200"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-6 pt-4 border-t-2 border-transparent flex flex-col justify-center items-center space-y-4 bg-gray-100 p-4 rounded-xl shadow-inner">
                  <div className="flex justify-between w-full max-w-xs">
                    <p className="text-2xl font-bold text-gray-900">Total:</p>
                    <p className="text-2xl font-bold text-green-700">
                      R$ {calculateCartTotal().toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full justify-center">
                    <button
                      onClick={() => setCurrentView('products')}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg text-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 w-full sm:w-auto"
                    >
                      Adicionar mais itens
                    </button>
                    <button
                      onClick={handleProceedToPayment} // Agora usa router.push
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg text-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 w-full sm:w-auto"
                    >
                      Próximo
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {currentView === 'payment' && (
          <div className="animate-fade-in">
            <button
              onClick={() => setCurrentView('cart')}
              className="absolute top-4 left-4 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
                <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
              </svg>
            </button>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Pagamento via Pix
            </h1>

            {paymentReceiverName && (
              <p className="text-xl font-semibold text-gray-800 mb-2">
                Para: {paymentReceiverName}
              </p>
            )}
            {paymentValue && (
              <p className="text-2xl font-bold text-purple-700 mb-4">
                Valor: R$ {parseFloat(paymentValue).toFixed(2).replace('.', ',')}
              </p>
            )}
            <p className="text-lg text-gray-700 mb-4">
              Escaneie o QR Code abaixo para realizar o pagamento:
            </p>
            <div className="flex justify-center mb-6">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?data=${paymentQr}&size=300x300`}
                alt="QR Code Pix"
                className="rounded-lg shadow-lg border-4 border-purple-300 transition-all duration-300 hover:shadow-xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/300x300/E0BBE4/FFFFFF?text=QR+Code+Indisponível';
                }}
              />
            </div>

            <button
              onClick={copyToClipboard}
              className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg text-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              Copiar Código Pix
            </button>

            {copied && (
              <p className="mt-4 text-green-600 font-semibold text-md animate-bounce">
                Código copiado com sucesso!
              </p>
            )}
            <button
              onClick={() => setCurrentView('cart')}
              className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg text-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
            >
              Voltar para o Carrinho
            </button>
          </div>
        )}
      </div>

      {showPersonalizationModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full relative transform scale-95 animate-scale-in">
            <button
              onClick={handleClosePersonalizationModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Personalizar {selectedProduct.nome}</h2>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">Ingredientes Padrão (remova se não quiser):</h3>
            <div className="mb-4 space-y-2">
              {Object.keys(personalizationOptions.ingredientesPadrao).map((ing, index) => (
                <label key={index} className="flex items-center text-gray-700">
                  <input
                    type="checkbox"
                    checked={personalizationOptions.ingredientesPadrao[ing]}
                    onChange={() => handleIngredientChange('ingredientesPadrao', ing)}
                    className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 capitalize">{ing.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">Adicionais Pagos:</h3>
            <div className="mb-4 space-y-2">
              {Object.keys(personalizationOptions.adicionaisPagos).map((add, index) => (
                <label key={index} className="flex items-center text-gray-700">
                  <input
                    type="checkbox"
                    checked={personalizationOptions.adicionaisPagos[add]}
                    onChange={() => handleIngredientChange('adicionaisPagos', add)}
                    className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 capitalize">{add.replace(/([A-Z])/g, ' $1').trim()} (R$ {
                    add === 'pera' ? '1.00' :
                    add === 'morango' ? '2.00' :
                    add === 'bananaExtra' ? '2.00' : '0.00'
                  })</span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-center mb-6">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="bg-gray-200 text-gray-700 font-bold py-1 px-3 rounded-l-lg text-sm transition-all duration-200 hover:bg-gray-300 active:scale-95"
              >
                -
              </button>
              <span className="bg-gray-100 text-gray-900 font-bold py-1 px-4 border-t border-b border-gray-200 text-sm">
                {personalizationOptions.quantidade}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="bg-gray-200 text-gray-700 font-bold py-1 px-3 rounded-r-lg text-sm transition-all duration-200 hover:bg-gray-300 active:scale-95"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg text-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50"
            >
              Confirmar (R$ {calculatePersonalizedPrice().toFixed(2).replace('.', ',')})
            </button>
          </div>
        </div>
      )}

      {/* Barra de Navegação Fixa */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-lg rounded-t-xl flex justify-around items-center py-3 px-4">
        <button
          onClick={() => setCurrentView('products')}
          className="flex flex-col items-center text-purple-600 hover:text-purple-800 transition-colors duration-200 focus:outline-none"
        >
          <HomeIcon />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button
          onClick={() => setCurrentView('cart')}
          className="flex flex-col items-center text-gray-600 hover:text-purple-600 transition-colors duration-200 focus:outline-none"
        >
          <ShoppingCartIcon />
          <span className="text-xs mt-1">Carrinho ({cartItems.length})</span>
        </button>
        <button
          onClick={() => console.log('Pedidos clicados')}
          className="flex flex-col items-center text-gray-600 hover:text-purple-600 transition-colors duration-200 focus:outline-none"
        >
          <ListIcon />
          <span className="text-xs mt-1">Pedidos</span>
        </button>
      </div>

      {/* Notificação Flutuante do Carrinho */}
      {showFloatingCartNotification && (
        <button
          onClick={() => setCurrentView('cart')}
          className="fixed bottom-16 left-0 right-0 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-extrabold py-3 px-4 sm:py-4 sm:px-6 rounded-t-2xl sm:rounded-t-3xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-between z-40 w-full max-w-sm sm:max-w-md mx-auto"
          style={{ borderRadius: '1.5rem 1.5rem 0 0' }} // Ajuste manual para garantir o arredondamento superior
        >
          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="bg-white text-teal-700 text-xs sm:text-sm font-bold px-2 py-1 rounded-full">{totalCartItems}</span>
            <span className="text-base sm:text-lg">Ver meu pedido</span>
          </div>
          <span className="text-lg sm:text-xl">R$ {totalCartPrice.toFixed(2).replace('.', ',')}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Estilos de Animação para Tailwind CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%) translateX(-50%); opacity: 0; }
          to { transform: translateY(0) translateX(-50%); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
